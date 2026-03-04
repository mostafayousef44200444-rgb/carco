import { PartialType } from '@nestjs/mapped-types';
import { CreateCarsuserDto } from './create-carsuser.dto';

export class UpdateCarsuserDto extends PartialType(CreateCarsuserDto) {
  existingImages?: string[];
}