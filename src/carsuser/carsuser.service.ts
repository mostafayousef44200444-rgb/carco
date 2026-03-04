import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Caruser, CaruserDocument } from './carsuser.schema';
import { CloudinaryService } from './cloudinary.service';
import { CreateCarsuserDto } from './dto/create-carsuser.dto';
import { UpdateCarsuserDto } from './dto/update-carsuser.dto';

@Injectable()
export class CarsuserService {
  constructor(
    @InjectModel(Caruser.name) private readonly caruserModel: Model<CaruserDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // رفع عربية جديدة
  async create(createCaruserDto: CreateCarsuserDto, files: Express.Multer.File[], ownerId: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    if (createCaruserDto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }
    if (createCaruserDto.doors && createCaruserDto.doors <= 0) {
      throw new BadRequestException('Doors must be greater than zero');
    }

    const images = await Promise.all(files.map(f => this.cloudinaryService.uploadBuffer(f.buffer)));
    const addedDate = createCaruserDto.addedDate || new Date();

    return this.caruserModel.create({ ...createCaruserDto, images, addedDate, owner: ownerId });
  }

  // جلب كل عربيات المستخدم مع فلترة و pagination
  async findAll(ownerId: string, query?: any) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = { owner: ownerId };

    if (query?.type) filter.type = query.type;
    if (query?.operationType) filter.operationType = query.operationType;
    if (query?.minPrice || query?.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }
    if (query?.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    const cars = await this.caruserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await this.caruserModel.countDocuments(filter);

    return { total, page, limit, cars };
  }

  // جلب عربية واحدة والتأكد من ملكية المستخدم
  async findOne(id: string, ownerId: string) {
    const car = await this.caruserModel.findOne({ _id: id, owner: ownerId });
    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return car;
  }

  // تحديث عربية
  async update(id: string, updateCaruserDto: UpdateCarsuserDto, files: Express.Multer.File[], ownerId: string) {
    const car = await this.findOne(id, ownerId);

    let images: string[] = [];

    if (files?.length) {
      const uploaded = await Promise.all(files.map(f => this.cloudinaryService.uploadBuffer(f.buffer)));
      images.push(...uploaded);
    }

    if (updateCaruserDto.existingImages) {
      images.push(...updateCaruserDto.existingImages);
    }

    if (updateCaruserDto.price && updateCaruserDto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }
    if (updateCaruserDto.doors && updateCaruserDto.doors <= 0) {
      throw new BadRequestException('Doors must be greater than zero');
    }

    Object.assign(car, { ...updateCaruserDto, images });
    return car.save();
  }

  // حذف عربية
  async remove(id: string, ownerId: string) {
    const car = await this.caruserModel.findOneAndDelete({ _id: id, owner: ownerId });
    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return { message: 'Car deleted successfully' };
  }

  // جلب كل العربيات اللي رفعها المستخدم (لواجهة "عربياتي")
  async findUserCars(userId: string) {
    return this.caruserModel.find({ owner: userId }).sort({ createdAt: -1 });
  }

  // جلب كل العربيات المعروضة للبيع من جميع المستخدمين
  async findAllForSale() {
    return this.caruserModel.find().sort({ createdAt: -1 });
  }
}