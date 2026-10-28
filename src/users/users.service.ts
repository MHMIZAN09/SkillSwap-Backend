import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const userOmitConfig = {
  password: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Find all users
  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  // Find user details by ID
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: userOmitConfig,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Update user status by ID
  async updateUserStatus(id: string, payload: UpdateUserStatusDto) {
    await this.findUserById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        status: payload.status,
      },
      omit: userOmitConfig,
    });
  }

  // Update user role by ID
  async updateUserRole(id: string, payload: UpdateUserRoleDto) {
    await this.findUserById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        role: payload.role as Role,
      },
      omit: userOmitConfig,
    });
  }

  // Update user details by ID
  async updateUserDetails(id: string, payload: UpdateUserDto) {
    await this.findUserById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      omit: userOmitConfig,
    });
  }

  // find user by email
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: userOmitConfig,
    });

    if (!user) {
      throw new ConflictException(`user with email ${email} already exists`);
    }
    return user;
  }
}
