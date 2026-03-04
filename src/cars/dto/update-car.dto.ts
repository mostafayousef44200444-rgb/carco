import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  // لإضافة إمكانية الاحتفاظ بالصور القديمة عند التحديث
  existingImages?: string[];
}