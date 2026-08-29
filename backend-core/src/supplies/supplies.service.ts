import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliesService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplyDto: CreateSupplyDto, user: any) {
    return this.prisma.supply.create({
      data: {
        name: createSupplyDto.name,
        description: createSupplyDto.description || "Fourniture scolaire",
        quantity: (createSupplyDto as any).quantity || 1,
        price: createSupplyDto.price || 0,
        type: (createSupplyDto as any).type || 'STATIONERY',
        schoolId: user.schoolId,
      }
    });
  }

  async findAllBySchool(user: any) {
    return this.prisma.supply.findMany({
      where: { schoolId: user.schoolId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByClass(classId: string, user: any) {
    // Supplies are generic per school in Prisma, not bound to a specific class.
    return this.findAllBySchool(user);
  }

  async remove(id: string, user: any) {
    const supply = await this.prisma.supply.findUnique({ where: { id } });
    if (!supply || supply.schoolId !== user.schoolId) {
      throw new NotFoundException('Item not found');
    }
    await this.prisma.supply.delete({ where: { id } });
    return { id };
  }
}

