import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string; // ex: "Mathématiques"

  @IsOptional()
  @IsInt()
  @Min(1)
  coefficient?: number;
}
