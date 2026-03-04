import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  type?: string;

  @Prop()
  operationType?: string;

  @Prop()
  status?: string;

  @Prop()
  addedDate?: Date;

  @Prop()
  factoryCondition?: string;

  @Prop()
  doors?: number;

  @Prop()
  modification?: string;

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
  features?: string[];
}

export const CarSchema = SchemaFactory.createForClass(Car);