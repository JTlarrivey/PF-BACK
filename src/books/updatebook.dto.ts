import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { CategoriesDto } from 'src/categories/categories.dto';

export class UpdateBookDto {

/**
   * Debe ser un string 
   * @example "El cuento de janeiro"
   */
@IsString()
@IsOptional()
title?: string;

/**
   * Debe ser un string
   * @example "Texto de prueba"
   */
@IsString()
@IsOptional()
description?: string;

/**
   * Debe ser un string
   * @example "https://example.com/image.jpg"
   */
@IsString()
@IsOptional()
photoUrl?: string;

/**
   * Debe ser un string 
   * @example "Gabriel Garcia Marquez"
   */
@IsString()
@IsOptional()
author?: string;

/**
   * Es un numero 
   * @example 2022
   */
@IsNumber()
@IsOptional()
publication_year?: number;

/**
   * Es un array
   * @example "[1, 2, 3]"
   */
@IsArray()
@ValidateNested({ each: true })
@Type(() => CategoriesDto) 
categories?: { connect: { id: number }[] };
}