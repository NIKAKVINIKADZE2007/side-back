import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { VerificationDto } from './dto/verification.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResendVerificationDto } from './dto/resendCode.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
    private emailSender: NodeMailerService,
  ) {}

  async SignUp({ email, firstName, lastName, password }: SignUpDto) {
    const user = await this.userModel.findOne({ email: email });
    if (user) throw new BadRequestException('user already exsists');

    const hashedPass = await bcrypt.hash(password, 10);
    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidateDate = new Date();
    otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000);

    const createUser = await this.userModel.create({
      email,
      lastName,
      firstName,
      password: hashedPass,
      otpCode,
      otpCodeValidateDate,
    });

    await this.emailSender.sendEmailText(email, 'Verification Code', otpCode);

    return { message: 'verify email' };
  }

  async verifyEmail({ email, otpCode }: VerificationDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('user not found');

    if (user.isVerified) throw new BadRequestException('user already verified');

    if (user.otpCodeValidateDate < new Date()) {
      throw new BadRequestException('otpCode expired');
    }

    if (otpCode !== user.otpCode) {
      throw new BadRequestException('otpCode dosent match');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: {
        isVerified: true,
        otpCode: null,
        otpCodeValidateDate: '',
      },
    });

    const payLoad = {
      id: user._id,
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return { message: 'verified successfully', accessToken };
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('invalid credentials');

    if (!user.isVerified) throw new BadRequestException('user not verified');

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) throw new BadRequestException('invalid credentials');

    const payLoad = {
      id: user._id,
    };

    const accsessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    return { accsessToken };
  }

  async resendVerificationCode({ email }: ResendVerificationDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('user not found');

    if (user.isVerified) throw new BadRequestException('user already verified');

    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidateDate = new Date();
    otpCodeValidateDate.setTime(otpCodeValidateDate.getTime() + 3 * 60 * 1000);

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { otpCode, otpCodeValidateDate },
    });

    await this.emailSender.sendEmailText(
      user.email,
      'Verification Code',
      otpCode,
    );

    return { message: 'Verify Email' };
  }
}
