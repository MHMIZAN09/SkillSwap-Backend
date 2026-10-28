import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('Users')
@ApiBasicAuth()
@ApiBearerAuth()
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('all-users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users list.' })
  async findAllUsers() {
    const result = await this.usersService.findAllUsers();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id', description: 'User unique ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.usersService.findUserById(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status by ID' })
  @ApiParam({ name: 'id', description: 'User unique ID' })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserStatusDto,
  ) {
    const result = await this.usersService.updateUserStatus(id, payload);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User status updated successfully',
      data: result,
    };
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role by ID' })
  @ApiParam({ name: 'id', description: 'User unique ID' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserRoleDto,
  ) {
    const result = await this.usersService.updateUserRole(id, payload);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User role updated successfully',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiParam({ name: 'id', description: 'User unique ID' })
  @ApiResponse({
    status: 200,
    description: 'User details updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUserDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ) {
    const result = await this.usersService.updateUserDetails(id, payload);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User details updated successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({
    status: 200,
    description: 'Current user details retrieved successfully.',
  })
  async getCurrentUser(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findUserById(userId);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Current user retrieved successfully',
      data: user,
    };
  }
}
