import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsNumber,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  billFromStreet: string;

  @IsString()
  @IsNotEmpty()
  billFromCity: string;

  @IsString()
  @IsNotEmpty()
  billFromPostCode: string;

  @IsString()
  @IsNotEmpty()
  billFromCountry: string;

  // Bill To
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsEmail()
  @IsNotEmpty()
  clientEmail: string;

  @IsString()
  @IsNotEmpty()
  clientStreet: string;

  @IsString()
  @IsNotEmpty()
  clientCity: string;

  @IsString()
  @IsNotEmpty()
  clientPostCode: string;

  @IsString()
  @IsNotEmpty()
  clientCountry: string;

  // Invoice Info
  @IsDateString()
  invoiceDate: Date;

  @IsString()
  @IsNotEmpty()
  paymentTerms: string; // e.g. "Net 30 Days"

  @IsString()
  projectDescription: string;

  // Item List
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsNumber()
  @Min(0)
  totalAmount: number;
}
