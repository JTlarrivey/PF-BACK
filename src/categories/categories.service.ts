import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async createCategory(name: string): Promise<Category> {
    return this.prisma.category.create({
      data: { name },
    });
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }
  async deleteCategory(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
  
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  
    return this.prisma.category.update({
      where: { id },
      data: { isDeleted: true }, // Establece isDeleted en true
    });
  }
}  