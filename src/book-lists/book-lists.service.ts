import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookListDto } from '../book-lists/create-booklists.dto';
import { UpdateBookListDto } from '../book-lists/update-booklists.dto';

@Injectable()
export class BookListsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookListDto: CreateBookListDto) {
    return this.prisma.bookList.create({
      data: {
        list_name: createBookListDto.list_name,
        description: createBookListDto.description,
        creation_date: createBookListDto.creation_date,
        user: {
          connect: { user_id: createBookListDto.user_id },  // Usar 'connect' si 'userId' es una relación
        },
      },
    });
  }
  async findAll() {
    return this.prisma.bookList.findMany({
      where: { isDeleted: false },  // Solo listas no eliminadas
    });
  }

  async findOne(id: number) {
    const bookList = await this.prisma.bookList.findFirst({
      where: {
        list_id: id,
        isDeleted: false,  // Solo buscar si no está eliminada
      },
    });

    if (!bookList) {
      throw new NotFoundException(`BookList with ID ${id} not found`);
    }

    return bookList;
  }

  async update(id: number, updateBookListDto: UpdateBookListDto) {
    const bookList = await this.prisma.bookList.update({
      where: { list_id: id },
      data: updateBookListDto,
    });

    return bookList;
  }

  async remove(id: number): Promise<void> {
    const bookList = await this.findOne(id);  // Verificar si la lista existe y no está eliminada

    await this.prisma.bookList.update({
      where: { list_id: id },
      data: { isDeleted: true },  // Marcar como eliminada
    });
  }
}
