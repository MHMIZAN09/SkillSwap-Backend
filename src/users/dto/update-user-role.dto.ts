import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: Role,
    description: 'The role of the user',
    example: Role.USER,
  })
  @IsEnum(Role, { message: 'Role must be a valid Role enum' })
  @IsNotEmpty()
  role: string;
}
