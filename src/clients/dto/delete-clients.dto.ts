import { IsString, IsOptional } from 'class-validator';

export class DeleteClientsDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  parent_id: string;
}
