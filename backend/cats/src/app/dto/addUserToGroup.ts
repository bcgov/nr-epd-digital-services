import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserToGroupDto {
  @ApiProperty({
    description: 'The unique identifier of the user in Keycloak',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
