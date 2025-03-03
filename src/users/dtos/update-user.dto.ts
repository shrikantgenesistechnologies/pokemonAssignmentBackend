import { PickType } from '@nestjs/swagger';
import { Users } from '../entity/user.entity';

export class UpdateUserDto extends PickType(Users, [
  'email',
  'name',
  'password',
  'lastLoginTimestamp',
]) {}
