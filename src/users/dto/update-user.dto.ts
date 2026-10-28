import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;
}
