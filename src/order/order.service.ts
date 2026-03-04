import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { Car, CarDocument } from '../cars/car.schema'; // تأكد من المسار
import { Caruser, CaruserDocument } from '../carsuser/carsuser.schema'; // تأكد من المسار
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Caruser.name) private caruserModel: Model<CaruserDocument>,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const { productId, productModel } = dto;

    // إصلاح error الـ findById عن طريق تحديد الـ Model بدقة
    const model: Model<any> = productModel === 'Car' ? this.carModel : this.caruserModel;
    const car = await model.findById(productId);
    
    if (!car) throw new NotFoundException('Car not found');

    const newOrder = new this.orderModel({
      ...dto,
      user: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order created' }],
    });

    return newOrder.save();
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    return this.orderModel.find({ user: new Types.ObjectId(userId) })
      .populate('productId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
}