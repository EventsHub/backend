import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username!: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  role!: string;
}
