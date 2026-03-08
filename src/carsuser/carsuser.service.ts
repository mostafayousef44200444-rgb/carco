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

  // أي مستخدم مسجل يمكنه إنشاء عربية
  async create(createCaruserDto: CreateCarsuserDto, files: Express.Multer.File[], ownerId: string) {
    if (!ownerId) throw new ForbiddenException('User not authenticated');
    if (!files || files.length === 0) throw new BadRequestException('At least one image is required');

    const images = await Promise.all(
      files.map(f => {
        if (!f.buffer) throw new BadRequestException('Invalid file upload');
        return this.cloudinaryService.uploadBuffer(f.buffer);
      }),
    );

    const addedDate = createCaruserDto.addedDate || new Date();

    return this.caruserModel.create({
      ...createCaruserDto,
      images,
      addedDate,
      owner: ownerId,
      ownerName: createCaruserDto.ownerName || 'Unknown',
      ownerPhone: createCaruserDto.ownerPhone || 'Unknown',
    });
  }

  // جلب كل العربيات مع فلترة و pagination
  async findAll(ownerId: string, query?: any) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = { owner: ownerId };
    if (query?.type) filter.type = query.type;
    if (query?.minPrice || query?.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }
    if (query?.search) filter.name = { $regex: query.search, $options: 'i' };

    const cars = await this.caruserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await this.caruserModel.countDocuments(filter);
    return { total, page, limit, cars };
  }

  // تعديل عربية – فقط المالك
  async update(id: string, updateCaruserDto: UpdateCarsuserDto, files: Express.Multer.File[], ownerId: string) {
    const car = await this.caruserModel.findById(id);
    if (!car) throw new NotFoundException('Car not found');
    if (car.owner.toString() !== ownerId) throw new ForbiddenException('You cannot edit this car');

    let images: string[] = [];
    if (files?.length) {
      const uploaded = await Promise.all(files.map(f => this.cloudinaryService.uploadBuffer(f.buffer)));
      images.push(...uploaded);
    }
    if (updateCaruserDto.existingImages) images.push(...updateCaruserDto.existingImages);

    Object.assign(car, { ...updateCaruserDto, images });
    return car.save();
  }

 // إضافة findOne
// carsuser.service.ts
async findOne(id: string, ownerId: string) {
  const car = await this.caruserModel.findById(id);
  if (!car) throw new NotFoundException('Car not found');

  // تحقق من الملكية
  if (car.owner.toString() !== ownerId) {
    throw new ForbiddenException('You cannot view this car');
  }

  return car;
}

// تعديل remove
async remove(id: string, ownerId: string) {
  const car = await this.caruserModel.findById(id);
  if (!car) throw new NotFoundException('Car not found');
  if (car.owner.toString() !== ownerId) throw new ForbiddenException('You cannot delete this car');

  await this.caruserModel.findByIdAndDelete(id);
  return { message: 'Car deleted successfully' };
}

  async findUserCars(userId: string) {
    return this.caruserModel.find({ owner: userId }).sort({ createdAt: -1 });
  }

  async findAllForSale() {
    return this.caruserModel.find().sort({ createdAt: -1 });
  }
}