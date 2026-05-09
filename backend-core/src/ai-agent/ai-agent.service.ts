import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FirestoreService } from '../firebase/firestore.service';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  constructor(private firestore: FirestoreService) {}

  private readonly usersCollection = 'users';

  /**
   * Listens to the 'bulletin.published' event.
   */
  @OnEvent('bulletin.published')
  async handleBulletinPublishedEvent(payload: { schoolId: string, academicYearId: string, classId?: string, term: number }) {
    this.logger.log(`[AI Agent] Received bulletin.published event for Term ${payload.term}`);
    const messageTemplate = `🤖 *Assistant Scolaire I.A.*\n\nBonjour Chers Parents,\n\nNous vous informons solennellement que les bulletins du Trimestre ${payload.term} sont désormais disponibles et publiés sur votre plateforme.\n\nVous pouvez les consulter dès maintenant via votre application.\n\nCordialement,\nLa Direction.`;
    this.logger.log(`[AI Agent] Formatting bulk communication: \n${messageTemplate}`);
    this.logger.log(`[AI Agent] 🟢 (Simulated) Sent bulk WhatsApp notifications to Parents.`);
  }

  /**
   * Listens to the 'announcement.created' event.
   */
  @OnEvent('announcement.created')
  async handleAnnouncementCreatedEvent(payload: { id: string, title: string, target: string }) {
    this.logger.log(`[AI Agent] Received announcement.created event: ${payload.title}`);
    const messageTemplate = `🤖 *Assistant Scolaire I.A.*\n\n🚨 *Nouvelle Annonce Importante*\n\n*${payload.title}*\n\nOuvrez votre application pour lire les détails.`;
    this.logger.log(`[AI Agent] Formatting targeted communication to: ${payload.target} \n${messageTemplate}`);
    this.logger.log(`[AI Agent] 🟢 (Simulated) Sent targeted WhatsApp notifications.`);
  }

  /**
   * Listens to the 'health.added' event.
   */
  @OnEvent('health.added')
  async handleHealthAddedEvent(payload: { studentId: string, symptoms: string, severity: string }) {
    this.logger.log(`[AI Agent] Received health.added event for Student ${payload.studentId} (Severity: ${payload.severity})`);
    
    if (payload.severity === 'HIGH' || payload.severity === 'MEDIUM') {
      const student = await this.firestore.findOne(this.usersCollection, payload.studentId) as any;

      if (student && student.studentProfile) {
        const parentPhone = student.studentProfile.fatherPhone || student.studentProfile.motherPhone;
        
        if (parentPhone) {
          const messageTemplate = `🤖 *Assistant Scolaire I.A.*\n\n‼️ *Alerte Infirmerie*\n\nBonjour, ceci est un message automatique. L'élève ${student.firstName} ${student.lastName} s'est présenté(e) à l'infirmerie pour: ${payload.symptoms}.\n\nMerci de contacter l'école pour plus d'informations.`;
          this.logger.log(`[AI Agent] Formatting emergency communication to: ${parentPhone} \n${messageTemplate}`);
          this.logger.log(`[AI Agent] 🔴 (Simulated) Sent emergency WhatsApp notification.`);
        }
      }
    }
  }
}

