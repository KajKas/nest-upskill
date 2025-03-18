import {
  IsString,
  IsEmail,
  Length,
  IsNumber,
  IsArray,
  Min,
  validate,
  ValidationError,
} from 'class-validator';
import { Supplier } from '../../infrastructure/supplier/supplier.entity';

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

  constructor(public readonly data: Partial<Supplier>) {
    this.name = data.name || '';
    this.email = data.email || '';
    this.managers = data.managers || [];
  }

  async validate(): Promise<ValidationError[]> {
    const errors = await validate(this);
    return errors;
  }
}
