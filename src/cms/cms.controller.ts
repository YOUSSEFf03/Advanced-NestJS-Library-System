// src/cms/cms.controller.ts
import { Controller, Get, Post, Body , Query} from '@nestjs/common'; 
import { CmsService } from './cms.service';
import { CreateCmsUserDto } from '../dto/create-cms-user.dto'; 


@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Post('create-cms-user')
  async createCmsUser(@Body() createCmsUserDto: CreateCmsUserDto) {
    return this.cmsService.createCmsUser(createCmsUserDto);
  }

  @Get('dashboard')
async getDashboardData(@Query('branchId') branchId?: string) {
  return this.cmsService.getDashboardData(branchId);
}
}