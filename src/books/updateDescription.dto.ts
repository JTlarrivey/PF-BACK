import { IsString } from 'class-validator';

export class UpdateDescriptionDto {
  @IsString()
  readonly description: string;
}
