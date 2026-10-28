import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UsersService } from '../users/users.service.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly saltRounds = 12;

  async registerUser(payload: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(payload.password, this.saltRounds);

    const newUser = await this.usersService.createUser({
      ...payload,
      password: hashedPassword,
    });

    return newUser;
  }

  async loginUser(payload: AuthLoginDto) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateJwtToken(user.id, user.email, user.role);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async generateJwtToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env
        .JWT_ACCESS_EXPIRES_IN as JwtSignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env
        .JWT_REFRESH_EXPIRES_IN as JwtSignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }
}
