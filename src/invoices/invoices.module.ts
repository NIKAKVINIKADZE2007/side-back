import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/schema/user.schema';
import { InvoiceSchema } from './schema/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: userSchema },
      {
        name: 'invoice',
        schema: InvoiceSchema,
      },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
