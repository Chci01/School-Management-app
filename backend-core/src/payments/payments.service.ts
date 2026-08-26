import { Injectable, ForbiddenException } from '@nestjs/common';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class PaymentsService {
    constructor(private firestore: FirestoreService) {}

    private readonly collection = 'payments';
    private readonly usersCollection = 'users';

    async create(createPaymentDto: any, user: any) {
        const { studentId, amount, tranche } = createPaymentDto;
        
        const student = await this.firestore.findOne(this.usersCollection, studentId) as any;
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        if (!student.schoolId) {
             throw new ForbiddenException('Student is not assigned to any school');
        }

        return this.firestore.create(this.collection, {
            studentId,
            amount,
            tranche,
            schoolId: student.schoolId,
            receiptNumber
        });
    }

    async findAll(user: any) {
        const db = this.firestore.getDb();
        let query = db.collection(this.collection);

        if (user.role !== 'SUPER_ADMIN') {
            query = query.where('schoolId', '==', user.schoolId) as any;
        }

        const snapshot = await query.get();
        const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        // Manually join students
        for (const p of payments) {
          p.student = await this.firestore.findOne(this.usersCollection, p.studentId);
        }

        return payments;
    }

    async findByStudent(studentId: string, user: any) {
        const student = await this.firestore.findOne(this.usersCollection, studentId) as any;
        
        if (!student) {
             throw new ForbiddenException('Student not found');
        }

        if (user.role === 'ADMIN_ECOLE' && student.schoolId !== user.schoolId) throw new ForbiddenException();
        if (user.role === 'ELEVE' && user.id !== studentId) throw new ForbiddenException();

        const db = this.firestore.getDb();
        const snapshot = await db.collection(this.collection)
            .where('studentId', '==', studentId)
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async initiateLigdiCashPayment(createPaymentDto: any, user: any) {
        const { studentId, amount, tranche, description, return_url, cancel_url, callback_url } = createPaymentDto;
        
        const student = await this.firestore.findOne(this.usersCollection, studentId) as any;
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        if (!student.schoolId) {
             throw new ForbiddenException('Student is not assigned to any school');
        }

        const external_id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const commande = {
            invoice: {
              items: [
                {
                  name: `Paiement Tranche: ${tranche}`,
                  description: description || `Frais de scolarité`,
                  quantity: 1,
                  unit_price: amount,
                  total_price: amount,
                },
              ],
              total_amount: amount,
              devise: "XOF",
              description: description || `Frais de scolarité - ${student.firstName} ${student.lastName}`,
              customer: studentId,
              customer_firstname: student.firstName || "Inconnu",
              customer_lastname: student.lastName || "Inconnu",
              customer_email: student.email || "test@test.com",
              external_id: external_id,
              otp: "",
            },
            store: { name: "School Management App", website_url: "https://schoolmanagement.com" },
            actions: {
              cancel_url: cancel_url || "https://schoolmanagement.com/paiement/annule",
              return_url: return_url || "https://schoolmanagement.com/paiement/succes",
              callback_url: callback_url || "https://schoolmanagement.com/api/callback/ligdicash",
            },
            custom_data: { transaction_id: external_id, studentId, tranche, amount },
        };

        try {
            const response = await fetch(
              "https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/create",
              {
                method: "POST",
                headers: {
                  Apikey: process.env.LIGDICASH_API_KEY || "",
                  Authorization: `Bearer ${process.env.LIGDICASH_API_TOKEN}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ commande }),
              }
            );
        
            const data = await response.json();
            
            if (data.response_code === "00") {
                return {
                    success: true,
                    url: data.response_text,
                    token: data.token, // Usually ligdicash returns a token in the response or you get it from the URL
                    external_id: external_id,
                    raw: data
                };
            } else {
                return {
                    success: false,
                    error: data.response_text || "Erreur de création de facture",
                    raw: data
                };
            }
        } catch (error) {
            throw new Error(`Erreur lors de la communication avec LigdiCash: ${error.message}`);
        }
    }

    async confirmLigdiCashPayment(token: string, user: any) {
        try {
            const response = await fetch(
                `https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/confirm/?invoiceToken=${token}`,
                {
                  method: "GET",
                  headers: {
                    Apikey: process.env.LIGDICASH_API_KEY || "",
                    Authorization: `Bearer ${process.env.LIGDICASH_API_TOKEN}`,
                    Accept: "application/json",
                  },
                }
            );
          
            const data = await response.json();

            // Check if payment was successful based on LigdiCash response
            // Adjust the condition based on the exact structure of LigdiCash `confirm` payload
            if (data.status === "completed" || data.response_code === "00") {
                
                // Retrieve custom data we sent during initiate (if available in payload)
                const customData = data.custom_data || {};
                const studentId = customData.studentId;
                const tranche = customData.tranche || "Tranche (LigdiCash)";
                const amount = customData.amount || data.invoice?.total_amount;

                if (studentId && amount) {
                    // Create the final payment in our Firebase DB
                    const paymentDto = { 
                        studentId, 
                        amount, 
                        tranche 
                    };
                    const createdPayment = await this.create(paymentDto, user);
                    return { success: true, status: 'completed', payment: createdPayment, raw: data };
                }

                return { success: true, status: 'completed', raw: data };
            }

            return { success: false, status: data.status || 'pending', raw: data };
        } catch (error) {
            throw new Error(`Erreur lors de la confirmation LigdiCash: ${error.message}`);
        }
    }
}
