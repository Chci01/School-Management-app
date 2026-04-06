import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateSupplyDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string; // SUPPLY or UNIFORM

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
