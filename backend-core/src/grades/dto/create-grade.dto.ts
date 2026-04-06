import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  academicYearId: string;

  @IsNumber()
  @Min(0)
  @Max(20)
  value: number;

  @IsOptional()
  @IsString()
  evaluationType?: string; // ex: "Devoir", "Composition", "Interrogation"
}
