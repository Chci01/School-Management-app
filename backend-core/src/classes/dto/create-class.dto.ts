import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string; // ex: "7ème Année A"

  @IsInt()
  @Min(1)
  @Max(12)
  level: number; // 1 to 12 (fundamental vs highschool)

  @IsString()
  @IsNotEmpty()
  academicYearId: string;
}
