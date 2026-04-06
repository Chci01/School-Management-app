import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles, Role } from '../auth/roles/roles.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(Role.STUDENT, Role.PARENT, Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  create(@Body() createDocumentDto: any, @Request() req) {
    return this.documentsService.create(createDocumentDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.documentsService.findAll(req.user);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: string,
    @Request() req
  ) {
    return this.documentsService.updateStatus(id, status, req.user);
  }
}
