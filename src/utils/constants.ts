import * as bcrypt from 'bcrypt';

export const HASHED_PASSWORD = bcrypt.hashSync('User123&', 10);

export const IMAGE_URL_CONST =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
