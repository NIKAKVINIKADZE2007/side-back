import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { VerificationDto } from './dto/verification.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResendVerificationDto } from './dto/resendCode.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.SignUp(signUpDto);
  }

  @Post('verify-email')
  verify(@Body() verifyDto: VerificationDto) {
    return this.authService.verifyEmail(verifyDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('resend-vefication-code')
  resendVerificationCode(@Body() email: ResendVerificationDto) {
    return this.authService.resendVerificationCode(email);
  }
}
