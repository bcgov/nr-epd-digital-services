import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length, IsEmail, IsNotEmpty } from 'class-validator';

@ObjectType()
@InputType()
export class BasePerson {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  middleName: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Field({defaultValue: false})
  @IsBoolean()
  isTaxExempt: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isEnvConsultant: boolean | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 20)
  @IsOptional()
  loginUserName: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  address_1: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  address_2: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  city: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 2)
  @IsOptional()
  prov: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  country: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 15)
  @IsOptional()
  postal: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  phone: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  mobile: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 50)
  @IsOptional()
  fax: string | null;

  @Field({ nullable: true })
  @IsString()
  @Length(0, 100)
  @IsOptional()
  @IsEmail()
  email: string | null;

  @Field({defaultValue: false})
  @IsBoolean()
  isActive: boolean;

  @Field({defaultValue: false})
  @IsBoolean()
  isDeleted?: boolean;
}
