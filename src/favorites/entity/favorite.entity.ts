import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { Users } from '../../users/entity/user.entity';
import { Pokemons } from '../../pokemons/entity/pokemon.entity';
import { FavoriteStatus } from '../../enums/favorites-status.enum';

@Entity()
@Unique(['user', 'pokemon'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.favorites)
  user: Users;

  @ManyToOne(() => Pokemons, (pokemon) => pokemon.favorites)
  pokemon: Pokemons;

  @Column({
    type: 'enum',
    enum: FavoriteStatus,
    default: FavoriteStatus.UNLIKED,
  })
  favoriteStatus: FavoriteStatus;
}
