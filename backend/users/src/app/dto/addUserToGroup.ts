import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserToGroupDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
