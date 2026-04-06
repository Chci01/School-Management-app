import { PartialType } from '@nestjs/mapped-types';
import { CreateConductDto } from './create-conduct.dto';

export class UpdateConductDto extends PartialType(CreateConductDto) {}
