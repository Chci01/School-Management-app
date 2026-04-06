import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliesService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplyDto: CreateSupplyDto, user: any) {
    return this.prisma.supplyItem.create({
      data: {
        ...createSupplyDto,
        schoolId: user.schoolId,
      },
    });
  }

  async findAllBySchool(user: any) {
    return this.prisma.supplyItem.findMany({
      where: { schoolId: user.schoolId },
      include: { class: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByClass(classId: string, user: any) {
    return this.prisma.supplyItem.findMany({
      where: { schoolId: user.schoolId, classId },
    });
  }

  async remove(id: string, user: any) {
    const supply = await this.prisma.supplyItem.findUnique({ where: { id } });
    if (!supply || supply.schoolId !== user.schoolId) {
      throw new NotFoundException('Item not found');
    }
    return this.prisma.supplyItem.delete({ where: { id } });
  }
}
