import {
  IsString,
  IsEmail,
  Length,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';

export class CreateSupplierCommand {
  @IsString()
  @Length(2, 100)
  readonly name: string;

  @IsEmail()
  @Length(2, 100)
  readonly email: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  readonly managers: number[];

  constructor(payload: { name: string; email: string; managers: number[] }) {
    this.name = payload.name;
    this.email = payload.email;
    this.managers = payload.managers;
  }
}
