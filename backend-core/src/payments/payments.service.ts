import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) {}

    async create(createPaymentDto: any, user: any) {
        const { studentId, amount, tranche } = createPaymentDto;
        
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        if (!student || (user.role !== 'SUPER_ADMIN' && student.schoolId !== user.schoolId)) {
            throw new ForbiddenException('Access denied');
        }

        const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        if (!student.schoolId) {
             throw new ForbiddenException('Student is not assigned to any school');
        }

        return this.prisma.payment.create({
            data: {
                studentId,
                amount: parseFloat(amount),
                type: 'TUITION',
                status: 'COMPLETED',
                method: 'CASH', // default fallback, LigdiCash handles its own creation
                schoolId: student.schoolId,
                reference: `${receiptNumber} - ${tranche || 'Tranche'}`,
            }
        });
    }

    async findAll(user: any) {
        const whereClause: any = {};

        if (user.role !== 'SUPER_ADMIN') {
            whereClause.schoolId = user.schoolId;
        }

        return this.prisma.payment.findMany({
            where: whereClause,
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, matricule: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByStudent(studentId: string, user: any) {
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        
        if (!student) {
             throw new ForbiddenException('Student not found');
        }

        if (user.role === 'ADMIN_ECOLE' && student.schoolId !== user.schoolId) throw new ForbiddenException();
        if (user.role === 'ELEVE' && user.userId !== studentId) throw new ForbiddenException();

        return this.prisma.payment.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async initiateLigdiCashPayment(createPaymentDto: any, user: any) {
        const { studentId, amount, tranche, description, return_url, cancel_url, callback_url } = createPaymentDto;
        
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
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
                    // Create the final payment in our PostgreSQL DB via Prisma
                    const createdPayment = await this.prisma.payment.create({
                        data: {
                            studentId,
                            amount: parseFloat(amount),
                            status: 'COMPLETED',
                            method: 'LIGDICASH',
                            schoolId: user.schoolId, // Note: For a webhook, `user.schoolId` might be unavailable depending on how user is fed. Fallback logic may be needed.
                            reference: tranche.toString(),
                            token: token
                        }
                    });
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
