import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Pokemons } from '../../pokemons/entity/pokemons.entity';
import { FavoriteStatus } from '../../enums/favorites-status.enum';

@Entity()
@Unique(['user', 'pokemon'])
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Pokemons, (pokemon) => pokemon.favorites)
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemons;

  @Column({
    type: 'enum',
    enum: FavoriteStatus,
    default: FavoriteStatus.UNLIKED,
    name: 'favorite_status',
  })
  favoriteStatus: FavoriteStatus;
}
