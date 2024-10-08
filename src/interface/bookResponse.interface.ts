import { Book } from '@prisma/client';
export interface BooksResponse {
    books: Book[];
    totalBooks: number;
    }
    