import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoriesService.getCategoryById(Number(id));
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Post()
  async createCategory(@Body('name') name: string) {
    return this.categoriesService.createCategory(name);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body('name') name: string) {
    return this.categoriesService.updateCategory(Number(id), name);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
