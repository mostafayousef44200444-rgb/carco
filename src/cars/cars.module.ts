import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car, CarSchema } from './car.schema';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]) // << هنا
  ],
  controllers: [CarsController],
  providers: [CarsService, CloudinaryService],
  exports: [CarsService], // لو هتستخدمه في modules تانية
})
export class CarsModule {}