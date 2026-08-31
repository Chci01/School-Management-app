import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinancesService {
  constructor(private prisma: PrismaService) {}

  // BUDGETS
  async createBudget(data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    return this.prisma.budget.create({
      data: {
        schoolId: data.schoolId,
        title: data.title,
        amount: parseFloat(data.amount),
        type: data.type || 'ANNUAL',
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(),
      }
    });
  }

  async getBudgets(schoolId: string) {
    return this.prisma.budget.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteBudget(id: string) {
    return this.prisma.budget.delete({ where: { id } });
  }

  // EXPENSES
  async createExpense(data: any) {
    if (data.date) data.date = new Date(data.date);
    
    return this.prisma.expense.create({
      data: {
        schoolId: data.schoolId,
        title: data.title,
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date || new Date(),
        description: data.description,
        reference: data.reference
      }
    });
  }

  async getExpenses(schoolId: string) {
    return this.prisma.expense.findMany({
      where: { schoolId },
      orderBy: { date: 'desc' }
    });
  }

  async deleteExpense(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }

  // SUMMARY
  async getSummary(schoolId: string) {
    const expenses = await this.prisma.expense.findMany({ where: { schoolId } });
    const budgets = await this.prisma.budget.findMany({ where: { schoolId } });

    const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    
    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBudget,
      totalExpenses,
      remainingBudget: totalBudget - totalExpenses,
      categoryTotals
    };
  }
}
