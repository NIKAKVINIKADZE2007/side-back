import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  billFromStreet: string;

  @Prop({ required: true })
  billFromCity: string;

  @Prop({ required: true })
  billFromPostCode: string;

  @Prop({ required: true })
  billFromCountry: string;

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  clientEmail: string;

  @Prop({ required: true })
  clientStreet: string;

  @Prop({ required: true })
  clientCity: string;

  @Prop({ required: true })
  clientPostCode: string;

  @Prop({ required: true })
  clientCountry: string;

  // Invoice Info
  @Prop({ required: true })
  invoiceDate: Date;

  @Prop({ required: true })
  paymentTerms: string;

  @Prop()
  projectDescription: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    default: [],
  })
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
