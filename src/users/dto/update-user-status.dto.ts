import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../generated/prisma/enums.js';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatus,
    description: 'The status of the user',
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus, { message: 'Status must be a valid UserStatus enum' })
  @IsNotEmpty()
  status: UserStatus;
}
