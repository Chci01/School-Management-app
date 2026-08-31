import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role, Roles } from '../auth/roles/roles.decorator';

@Controller('finances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post('budgets')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  createBudget(@Body() body: any, @Request() req: any) {
    return this.financesService.createBudget({ ...body, schoolId: body.schoolId || req.user.schoolId });
  }

  @Get('budgets')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  getBudgets(@Query('schoolId') querySchoolId: string, @Request() req: any) {
    const schoolId = querySchoolId || req.user.schoolId;
    return this.financesService.getBudgets(schoolId);
  }

  @Delete('budgets/:id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  deleteBudget(@Param('id') id: string) {
    return this.financesService.deleteBudget(id);
  }

  @Post('expenses')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  createExpense(@Body() body: any, @Request() req: any) {
    return this.financesService.createExpense({ ...body, schoolId: body.schoolId || req.user.schoolId });
  }

  @Get('expenses')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  getExpenses(@Query('schoolId') querySchoolId: string, @Request() req: any) {
    const schoolId = querySchoolId || req.user.schoolId;
    return this.financesService.getExpenses(schoolId);
  }

  @Delete('expenses/:id')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  deleteExpense(@Param('id') id: string) {
    return this.financesService.deleteExpense(id);
  }

  @Get('summary')
  @Roles(Role.ADMIN_ECOLE, Role.SUPER_ADMIN)
  getSummary(@Query('schoolId') querySchoolId: string, @Request() req: any) {
    const schoolId = querySchoolId || req.user.schoolId;
    return this.financesService.getSummary(schoolId);
  }
}
