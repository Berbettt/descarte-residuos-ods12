import { IsString, IsEnum, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateDisposalRecordDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsMongoId() // Valida se é um ID real do MongoDB
  @IsNotEmpty()
  disposalPointId: string;

  @IsEnum(['plastic', 'paper', 'organic', 'electronic', 'glass', 'other'])
  wasteType: string;
}
