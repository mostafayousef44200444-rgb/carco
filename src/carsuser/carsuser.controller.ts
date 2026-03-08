import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CarsuserService } from './carsuser.service';
import { CreateCarsuserDto } from './dto/create-carsuser.dto';
import { UpdateCarsuserDto } from './dto/update-carsuser.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('carsuser')
export class CarsuserController {
  constructor(private readonly carsuserService: CarsuserService) {}

  // 1. جلب سيارات الشخص المسجل حالياً (يجب أن تكون قبل :id لضمان عدم التداخل)
  @UseGuards(JwtAuthGuard)
  @Get('my/cars')
  async getMyCars(@Req() req) {
    // استخراج الـ ID من التوكن (تأكدنا من الحالات المختلفة لاسم الحقل)
    const userId = req.user?.id || req.user?.userId || req.user?.sub;
    
    if (!userId) {
      throw new ForbiddenException('لم يتم العثور على هوية المستخدم');
    }
    
    // استدعاء الخدمة (تم تصحيح الحرف الصغير)
    return this.carsuserService.findUserCars(userId);
  }

  // 2. إنشاء عربية جديدة
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() dto: CreateCarsuserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const ownerId = req.user?.id || req.user?.userId;
    return this.carsuserService.create(dto, files, ownerId);
  }

  // 3. جلب كل العربيات للبيع (للعامة)
  @Get('all-for-sale')
  getAllForSale() {
    return this.carsuserService.findAllForSale();
  }

  // 4. جلب تفاصيل عربية معينة
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const ownerId = req.user?.id || req.user?.userId;
    return this.carsuserService.findOne(id, ownerId);
  }

  // 5. تعديل عربية
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCarsuserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const ownerId = req.user?.id || req.user?.userId;
    return this.carsuserService.update(id, dto, files, ownerId);
  }

  // 6. حذف عربية
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const ownerId = req.user?.id || req.user?.userId;
    return this.carsuserService.remove(id, ownerId);
  }
}