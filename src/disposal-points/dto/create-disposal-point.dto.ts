import {
  IsString,
  IsEnum,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeoLocationDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class CreateDisposalPointDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsEnum(['public', 'private'])
  locationType: string;

  @IsArray()
  @IsString({ each: true })
  acceptedCategories: string[];

  @ValidateNested()
  @Type(() => GeoLocationDto)
  @IsNotEmpty()
  geoLocation: GeoLocationDto;
}
