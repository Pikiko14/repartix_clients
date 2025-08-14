import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class CoordsDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateClientsDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsNumber()
  dni?: number;

  @IsString()
  address: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CoordsDto)
  coords: CoordsDto;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  parent_id: string;
}
