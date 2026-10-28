// src/auth/auth.controller.ts
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() payload: CreateUserDto) {
    const result = await this.authService.registerUser(payload);
    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body() payload: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(payload);

    await this.setRefreshTokenCookie(res, accessToken, refreshToken);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: { accessToken, refreshToken },
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Logged out successfully',
    };
  }

  // Helper Method for Cookie
  private async setRefreshTokenCookie(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
