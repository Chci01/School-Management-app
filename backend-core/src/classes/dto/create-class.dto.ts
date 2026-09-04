import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string; // ex: "7ème Année A"

  @IsString()
  @IsNotEmpty()
  level: string; // ex: "1", "6ème", "Terminale"

  @IsString()
  @IsNotEmpty()
  academicYearId: string;
}
