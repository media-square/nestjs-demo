import { ApiProperty } from '@nestjs/swagger';

import { AdvisorBaseSchema } from '../advisor/advisor.dto';

export const AuthLoginScheme = AdvisorBaseSchema.pick({
  email: true,
  password: true,
});

export const AuthRegisterScheme = AdvisorBaseSchema.pick({
  email: true,
  password: true,
  name: true,
});

export class AuthLoginDto {
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @ApiProperty({ example: 'verysecretpassword' })
  password: string;
}

export class AuthRegisterDto extends AuthLoginDto {
  @ApiProperty({ example: 'Your name' })
  name: string;
}
