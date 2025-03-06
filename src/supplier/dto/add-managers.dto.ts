import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class AddManagersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  managers: number[];
}
