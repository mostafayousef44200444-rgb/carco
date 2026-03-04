import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './car.schema';
import { CloudinaryService } from './cloudinary.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCarDto: CreateCarDto, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const images = await Promise.all(files.map(file => this.cloudinaryService.uploadBuffer(file.buffer)));
    return this.carModel.create({ ...createCarDto, images });
  }

  findAll() {
    return this.carModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const car = await this.carModel.findById(id);
    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto, files?: Express.Multer.File[]) {
    const car = await this.findOne(id);
    let images: string[] = [];

    if (files?.length) {
      const uploaded = await Promise.all(files.map(f => this.cloudinaryService.uploadBuffer(f.buffer)));
      images.push(...uploaded);
    }

    if (updateCarDto.existingImages) {
      images.push(...updateCarDto.existingImages);
    }

    Object.assign(car, { ...updateCarDto, images });
    return car.save();
  }

  async remove(id: string) {
    const car = await this.carModel.findByIdAndDelete(id);
    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return { message: 'Car deleted successfully' };
  }}