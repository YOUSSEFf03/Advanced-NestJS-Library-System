import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateCmsUserDto } from '../dto/create-cms-user.dto';
import { CreateAuthorDto } from '../dto/create-author.dto'; 

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string) {
    const normalizedEmail = email.toLowerCase();
    return this.userModel.findOne({ email: normalizedEmail }).exec();
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async updateReturnRate(userId: string, isLate: boolean): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) return;
  
    if (isLate) user.returnRate -= 10; // Decrease return rate if late
    else user.returnRate += 10; // Increase return rate if on time
  
    user.returnRate = Math.max(0, Math.min(100, user.returnRate)); // Keep return rate between 0 and 100
    await user.save();
  }



  async createCmsUser(createCmsUserDto: CreateCmsUserDto): Promise<User> {
    const { email, fullName, role } = createCmsUserDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8); // Random 8-character password
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
      fullName,
      returnRate: 100, 
      borrowHistory: [], 
    });

    await newUser.save();

    
    console.log(`New CMS user created. Email: ${email}, Password: ${password}`);

    return newUser;
  }




  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<User> {
    const { email, name } = createAuthorDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generate a random PIN code (password)
    const pinCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
    const hashedPinCode = await bcrypt.hash(pinCode, 10);

    
    const newAuthor = new this.userModel({
      email,
      password: hashedPinCode,
      role: 'Author', 
      fullName: name, 
      returnRate: 100, 
      borrowHistory: [], 
    });

    await newAuthor.save();

   
    console.log(`New author created. Email: ${email}, PIN Code: ${pinCode}`);

    return newAuthor;
  }
}