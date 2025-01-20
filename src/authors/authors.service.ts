import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from '../schemas/author.schema';
import { User } from '../schemas/user.schema';
import { Book } from '../schemas/book.schema';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { CreateBookDto } from '../dto/create-book.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async addAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const { email, name } = createAuthorDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generate a random PIN code (password)
    const pinCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
    const hashedPinCode = await bcrypt.hash(pinCode, 10);

    // Create the new user (author) in the Users collection
    const newUser = new this.userModel({
      email,
      password: hashedPinCode,
      role: 'Author', // Set the role to 'Author'
      fullName: name, // Use the name from the DTO
      returnRate: 100, // Default return rate
      borrowHistory: [], // Empty borrow history
    });

    await newUser.save();

    
    const newAuthor = new this.authorModel({
      userId: newUser._id, 
      books: [], 
    });

    await newAuthor.save();

    
    console.log(`New author created. Email: ${email}, PIN Code: ${pinCode}`);

    return newAuthor;
  }
  async submitBook(createBookDto: CreateBookDto): Promise<any> {
    const { authorId, branches, ...bookDetails } = createBookDto;
  
    const author = await this.authorModel.findById(authorId).exec();
    if (!author) {
      throw new BadRequestException('Author not found');
    }
  
    
    const newBook = new this.bookModel({
      ...bookDetails,
      branches,
      authorId,
      status: 'pending',
    });
    await newBook.save();
  
    
    author.books.push((newBook._id as any).toString());
    await author.save();
  
    return newBook;
  }

  async findAllAuthors(): Promise<Author[]> {
    return this.authorModel.find().exec();
  }

  async findAuthorById(authorId: string): Promise<Author> {
    const author = await this.authorModel.findById(authorId).exec();
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async getBookRequestsByStatus(authorId: string) {
    const books = await this.bookModel.find({ authorId }).exec();
    const statusCounts = {
      approved: 0,
      rejected: 0,
      pending: 0,
    };

    books.forEach((book) => {
      if (book.status === 'approved') statusCounts.approved++;
      else if (book.status === 'rejected') statusCounts.rejected++;
      else if (book.status === 'pending') statusCounts.pending++;
    });

    return statusCounts;
  }

  async getAverageApprovalTime(authorId: string) {
    const books = await this.bookModel.find({ authorId, status: 'approved' }).exec();
    if (books.length === 0) {
      return { averageApprovalTimeInMinutes: 0 };
    }
  
    const totalApprovalTime = books.reduce((total, book) => {
      const submissionDate = new Date(book.createdAt);
      const approvalDate = new Date(book.updatedAt); 
      const approvalTimeInMinutes = (approvalDate.getTime() - submissionDate.getTime()) / (1000 * 60); 
      return total + approvalTimeInMinutes;
    }, 0);
  
    const averageApprovalTimeInMinutes = totalApprovalTime / books.length;
    return { averageApprovalTimeInMinutes };
  }


  async getBranchDistribution(authorId: string): Promise<{ branchId: string, totalCopies: number }[]> {
    const books = await this.bookModel.find({ authorId }).exec();
    console.log('Books:', books); // Debug: Check if books are found
  
    const branchDistributionMap = new Map<string, number>();
  
    books.forEach(book => {
      console.log('Book:', book); // Debug: Check each book
      const copiesPerBranch = book.copies / book.branches.length; // Distribute copies equally across branches
      book.branches.forEach(branchId => {
        const currentCopies = branchDistributionMap.get(branchId) || 0;
        branchDistributionMap.set(branchId, currentCopies + copiesPerBranch);
      });
    });
  
    console.log('Branch Distribution Map:', branchDistributionMap); // Debug: Check the final map
  
    return Array.from(branchDistributionMap.entries()).map(([branchId, totalCopies]) => ({
      branchId,
      totalCopies: Math.round(totalCopies), // Round to the nearest whole number
    }));
  }
}