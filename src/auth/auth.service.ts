import { BadRequestException, Injectable } from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async SignUp({ email, firstName, lastName, password }: SignUpDto) {
    const user = await this.userModel.findOne({ email: email });
    if (user) throw new BadRequestException('user already exsists');

    const hashedPass = await bcrypt.hash(password, 10);
    const createUser = await this.userModel.create({
      email,
      lastName,
      firstName,
      password: hashedPass,
    });

    return createUser;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
