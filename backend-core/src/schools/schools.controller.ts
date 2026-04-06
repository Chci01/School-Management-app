import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LicenseGuard } from '../auth/license.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';
import { Request } from '@nestjs/common';


@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get('public')
  findPublic() {
    return this.schoolsService.findPublic();
  }

  @Post()
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Post('generate-license')
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async generateLicense(@Body('days') days: number, @Request() req: any) {
    const voucher = await this.schoolsService.generateLicense(days || 365, req.user.id);
    return { success: true, voucher };
  }

  @Get('licenses')
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getLicenses() {
    return this.schoolsService.getAllLicenses();
  }

  @Get()
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, LicenseGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  toggleActive(@Param('id') id: string) {
    return this.schoolsService.toggleActive(id);
  }

  @Post(':id/activate-license')
  // We explicitly DO NOT use LicenseGuard here so expired schools can activate!
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async activateLicense(
    @Param('id') id: string,
    @Body('licenseKey') licenseKey: string,
    @Request() req: any
  ) {
    try {
      const result = await this.schoolsService.activateLicense(id, licenseKey, req.user.id);
      return { success: true, school: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}
