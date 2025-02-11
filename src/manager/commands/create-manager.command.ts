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

export class CreateManagerCommand {
  @IsString()
  @Length(2, 100)
  readonly name: string;

  @IsEmail()
  @Length(2, 100)
  readonly email: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  readonly suppliers: number[];

  constructor(payload: { name: string; email: string; suppliers: number[] }) {
    this.name = payload.name;
    this.email = payload.email;
    this.suppliers = payload.suppliers;
  }

  async validate(): Promise<ValidationError[]> {
    const errors = await validate(this);
    return errors;
  }
}
