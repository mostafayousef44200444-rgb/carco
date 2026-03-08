import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  // 1. الدالة الموجودة عندك (إنشاء طلب جديد)
  async createOrder(userId: string, dto: any) {
    const newOrder = new this.orderModel({
      ...dto,
      user: new Types.ObjectId(userId),
      customerDetails: {
        fullName: dto.customerDetails?.fullName || 'غير مسجل',
        email: dto.customerDetails?.email || 'غير مسجل',
        phone: dto.customerDetails?.phone || 'غير مسجل',
        address: dto.customerDetails?.address || 'غير مسجل',
        city: dto.customerDetails?.city || ''
      },
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order created', at: new Date() }]
    });
    return newOrder.save();
  }

  // 2. ✅ الدالة الجديدة (تحديث طلب موجود ببيانات الـ Checkout)
  async updateOrder(orderId: string, dto: any) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { 
        $set: { 
          customerDetails: dto.customerDetails, // هنا بنحط البيانات اللي مصطفى كتبها في الفورم
          payment: dto.payment,
          status: 'pending' 
        },
        $push: { statusHistory: { status: 'updated', note: 'Customer details added via checkout', at: new Date() } }
      },
      { new: true } // يرجع الطلب بعد التعديل
    ).exec();
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    return this.orderModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('user', 'firstName lastName email')
      .populate('productId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
  // دالة جديدة لجلب كل الطلبات للأدمن
async getAllOrdersForAdmin() {
  return this.orderModel
    .find() // هنا شيلنا الفلترة عشان نجيب كل حاجة
    .populate('user', 'firstName lastName email')
    .populate('productId')
    .sort({ createdAt: -1 })
    .exec();
}
async updateOrderStatus(orderId: string, status: string) {
  return this.orderModel.findByIdAndUpdate(
    orderId,
    { 
      $set: { status: status },
      $push: { statusHistory: { status: status, at: new Date(), note: `Status updated by Admin` } }
    },
    { new: true }
  );
}
}