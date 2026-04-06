import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateAcademicYearDto {
  @IsString()
  @IsNotEmpty()
  name: string; // ex: "2025-2026"

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
