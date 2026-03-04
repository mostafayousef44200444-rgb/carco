import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type CaruserDocument = Caruser & Document;

@Schema({ timestamps: true })
export class Caruser {
  // الصور
  @Prop({ type: [String], required: true })
  images: string[];

  // بيانات أساسية عن العربية
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: ['Sale', 'Rent'], required: true })
  type: 'Sale' | 'Rent';

 
  @Prop()
  status?: string; // حالة الإعلان: active / pending / sold

  @Prop()
  addedDate?: Date;

  @Prop()
  factoryCondition?: string; // حالة المصنع أو جديدة / مستعملة

  @Prop()
  doors?: number;

  @Prop()
  modification?: string; // أي تعديل حصل على العربية

  @Prop()
  horsepower?: number;

  @Prop()
  engineCapacity?: number;

  @Prop()
  fuelType?: string;

  @Prop()
  transmission?: string;

  @Prop()
  year?: number;

  @Prop()
  color?: string;

  @Prop({ type: [String] })
  features?: string[]; // مميزات إضافية

  // 🏠 بيانات المالك (مستخدم)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  ownerPhone: string;

  @Prop()
  ownerEmail?: string;

 // الشكل اللي بيعمل المشكلة غالباً
@Prop({ type: Object })
ownerAddress: any;
  };


export const CaruserSchema = SchemaFactory.createForClass(Caruser);