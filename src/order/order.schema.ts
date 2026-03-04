import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {

  // 👤 المستخدم اللي عمل الطلب
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  // 🚗 العربية المطلوبة (من Cars أو Carsuser)
  @Prop({ type: Types.ObjectId, refPath: 'productModel', required: true })
  productId: Types.ObjectId;

  // 🔀 مصدر العربية (Admin Cars ولا User Cars)
  @Prop({ required: true, enum: ['Car', 'Caruser'] })
  productModel: 'Car' | 'Caruser';

  // 🛒 نوع العملية (شراء أو إيجار)
  @Prop({ required: true, enum: ['Sale', 'Rent'] })
  orderType: 'Sale' | 'Rent';

  // 💰 السعر وقت إنشاء الطلب (Snapshot)
  @Prop({ required: true })
  price: number;

  // 📅 في حالة الإيجار فقط
  @Prop()
  rentStart?: Date;

  @Prop()
  rentEnd?: Date;

  // 📦 حالة الطلب
  @Prop({
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
  })
  status: string;

  // 💳 بيانات الدفع
  @Prop({
    type: {
      method: { type: String, required: true }, // cash | card | instapay
      notes: { type: String },
    },
  })
  payment?: {
    method: string;
    notes?: string;
  };

  // 📝 سجل تغيّر الحالة
  @Prop({
    type: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    default: [],
  })
  statusHistory: {
    status: string;
    at: Date;
    note?: string;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);