// src/user/user.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('البريد الإلكتروني مستخدم من قبل');

    const user = await this.userModel.create(dto);
   const token = this.generateToken(user._id.toString(), user.role);

    return { user, token };
  }

 async login(dto: LoginUserDto) {
  const user = await this.userModel.findOne({ email: dto.email });
  if (!user) throw new NotFoundException('بيانات الدخول غير صحيحة');

  // استخدم bcrypt مباشرة
  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) throw new NotFoundException('بيانات الدخول غير صحيحة');

  const token = this.generateToken(user._id.toString(), user.role);

  return { user, token };
}

  async findAll() {
    return this.userModel.find({}, '-password');
  }

  private generateToken(id: string, role: string) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '8d' });
  }
}
