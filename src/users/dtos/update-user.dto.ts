import { PickType } from '@nestjs/swagger';
import { Users } from '../entity/users.entity';

export class UpdateUserDto extends PickType(Users, [
  'email',
  'name',
  'password',
  'lastLoginTimestamp',
]) {}
