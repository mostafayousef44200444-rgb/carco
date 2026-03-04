import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsuserService } from './carsuser.service';
import { CarsuserController } from './carsuser.controller';
import { Caruser, CaruserSchema } from './carsuser.schema';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Caruser.name, schema: CaruserSchema }])
  ],
  controllers: [CarsuserController],
  providers: [CarsuserService, CloudinaryService],
  exports: [CarsuserService], // لو هتستخدمه في modules تانية
})
export class CarsuserModule {}