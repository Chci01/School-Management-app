"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiAgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
let AiAgentService = AiAgentService_1 = class AiAgentService {
    prisma;
    logger = new common_1.Logger(AiAgentService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleBulletinPublishedEvent(payload) {
        this.logger.log(`[AI Agent] Received bulletin.published event for Term ${payload.term}`);
        const messageTemplate = `🤖 *Assistant Scolaire I.A.*\n\nBonjour Chers Parents,\n\nNous vous informons solennellement que les bulletins du Trimestre ${payload.term} sont désormais disponibles et publiés sur votre plateforme.\n\nVous pouvez les consulter dès maintenant via votre application.\n\nCordialement,\nLa Direction.`;
        this.logger.log(`[AI Agent] Formatting bulk communication: \n${messageTemplate}`);
        this.logger.log(`[AI Agent] 🟢 (Simulated) Sent bulk WhatsApp notifications to Parents.`);
    }
    async handleAnnouncementCreatedEvent(payload) {
        this.logger.log(`[AI Agent] Received announcement.created event: ${payload.title}`);
        const messageTemplate = `🤖 *Assistant Scolaire I.A.*\n\n🚨 *Nouvelle Annonce Importante*\n\n*${payload.title}*\n\nOuvrez votre application pour lire les détails.`;
        this.logger.log(`[AI Agent] Formatting targeted communication to: ${payload.target} \n${messageTemplate}`);
        this.logger.log(`[AI Agent] 🟢 (Simulated) Sent targeted WhatsApp notifications.`);
    }
    async handleHealthAddedEvent(payload) {
        this.logger.log(`[AI Agent] Received health.added event for Student ${payload.studentId} (Severity: ${payload.severity})`);
        if (payload.severity === 'HIGH' || payload.severity === 'MEDIUM') {
            const student = await this.prisma.user.findUnique({
                where: { id: payload.studentId },
                include: { studentProfile: true }
            });
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
};
exports.AiAgentService = AiAgentService;
__decorate([
    (0, event_emitter_1.OnEvent)('bulletin.published'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentService.prototype, "handleBulletinPublishedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('announcement.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentService.prototype, "handleAnnouncementCreatedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('health.added'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAgentService.prototype, "handleHealthAddedEvent", null);
exports.AiAgentService = AiAgentService = AiAgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiAgentService);
//# sourceMappingURL=ai-agent.service.js.map