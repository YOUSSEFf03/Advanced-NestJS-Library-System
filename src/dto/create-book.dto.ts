// src/dto/create-book.dto.ts
import { IsString, IsNumber, IsUrl, IsArray, IsBoolean, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title!: string;

  @IsString()
  genre!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  minAge!: number;

  @IsNumber()
  @Min(1)
  copies!: number;

  @IsUrl()
  pdfUrl!: string;

  @IsUrl()
  coverImageUrl!: string;

  @IsBoolean()
  isOpenToReview!: boolean;

  @IsArray()
  @IsString({ each: true })
  branches!: string[];

  @IsString()
  authorId!: string;
}