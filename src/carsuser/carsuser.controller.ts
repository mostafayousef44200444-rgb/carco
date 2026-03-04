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
} from '@nestjs/common';
import { CarsuserService } from './carsuser.service';
import { CreateCarsuserDto } from './dto/create-carsuser.dto';
import { UpdateCarsuserDto } from './dto/update-carsuser.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('carsuser')
@UseGuards(JwtAuthGuard)
export class CarsuserController {
  constructor(private readonly carsuserService: CarsuserService) {}

  // رفع عربية
  @Post()
    @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(@Body() dto: CreateCarsuserDto, @UploadedFiles() files: Express.Multer.File[], @Req() req) {
    const ownerId = req.user.userId;
    return this.carsuserService.create(dto, files, ownerId);
  }

  // جلب كل عربيات المستخدم
  @Get()
  
  findAll(@Req() req, @Query() query) {
    const ownerId = req.user.userId;
    return this.carsuserService.findAll(ownerId, query);
  }

  // جلب عربية واحدة
  @Get(':id')
  
  findOne(@Param('id') id: string, @Req() req) {
    const ownerId = req.user.userId;
    return this.carsuserService.findOne(id, ownerId);
  }

  // تحديث عربية
  @Put(':id')
    @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCarsuserDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req
  ) {
    const ownerId = req.user.userId;
    return this.carsuserService.update(id, dto, files, ownerId);
  }

  // حذف عربية
  @Delete(':id')
    @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    const ownerId = req.user.userId;
    return this.carsuserService.remove(id, ownerId);
  }

  // واجهة "عربياتي" - كل العربيات الخاصة بالمستخدم
  @Get('my/cars')
  getMyCars(@Req() req) {
    const ownerId = req.user.userId;
    return this.carsuserService.findUserCars(ownerId);
  }

  // واجهة "كل العربيات المعروضة للبيع"
  @Get('all-for-sale')
  getAllForSale() {
    return this.carsuserService.findAllForSale();
  }
}