
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
// src/order/order.controller.ts
// src/order/order.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  Req, 
  UseGuards, 
  Get, 
  Patch, 
  Param, 
  Query // 👈 ضيف دي هنا
} from '@nestjs/common';
// تأكد من وجود Param و Patch هنا ^^^
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    // تأكد من استخدام المفتاح الصحيح الموجود في الـ JWT Payload (غالباً id)
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.orderService.createOrder(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req, @Query('page') page: string) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.orderService.getUserOrders(userId, Number(page) || 1);
  }
  @Patch(':id') // أو @Put(':id')
async updateOrder(@Param('id') id: string, @Body() dto: any) {
  return this.orderService.updateOrder(id, dto);
}
@UseGuards(JwtAuthGuard) // تأكد إن مصطفى معاه التوكن
@Get('admin/all')
async getAllOrders() {
  return this.orderService.getAllOrdersForAdmin();
}
@UseGuards(JwtAuthGuard)
@Patch('admin/update-status/:id')
async updateStatus(@Param('id') id: string, @Body('status') status: string) {
  return this.orderService.updateOrderStatus(id, status);
}
}