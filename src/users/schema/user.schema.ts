import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String })
  otpCode: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'invoice' }] })
  invoices: Types.ObjectId[];

  @Prop({ type: Date })
  otpCodeValidateDate: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
