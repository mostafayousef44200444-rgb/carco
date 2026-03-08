import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CaruserDocument = Caruser & Document;

@Schema({ timestamps: true })
export class Caruser {
  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: ['Sale', 'Rent'], required: true })
  type: 'Sale' | 'Rent';

  @Prop()
  status?: string;
@Prop()
kilometers?: number;
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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  ownerPhone: string;

  @Prop()
  ownerEmail?: string;

  @Prop({ type: Object, required: false })
  ownerAddress?: any;
}

export const CaruserSchema = SchemaFactory.createForClass(Caruser);