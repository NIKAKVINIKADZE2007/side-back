import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Invoice } from './schema/schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('invoice') private invoiceModel: Model<Invoice>,
  ) {}

  async create(userId: string, createInvoiceDto: CreateInvoiceDto) {
    const user = await this.userModel.findByIdAndUpdate(userId);
    if (!user) throw new NotFoundException('user not found');

    const invoice = await this.invoiceModel.create({
      ...createInvoiceDto,
      user: userId,
    });

    await Promise.all([
      invoice.save(),
      this.userModel.findByIdAndUpdate(userId, {
        $push: { invoices: invoice._id },
      }),
    ]);

    return invoice;
  }

  findAll() {
    return this.invoiceModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
