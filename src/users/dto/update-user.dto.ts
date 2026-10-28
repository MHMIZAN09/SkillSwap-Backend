import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Optional()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Optional()
  @IsNotEmpty()
  lastName?: string;
}
