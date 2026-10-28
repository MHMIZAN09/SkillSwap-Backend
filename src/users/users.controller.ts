import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
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
}
