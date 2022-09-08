import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'cards'})
export class Card {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id!: number;

    @Column()
    title: string;

    @Column()
    description!: string;

    @Column({name: 'url_image'})
    urlImage!: string;

    @Column()
    address: string;

    @Column({name: 'start_date', type: 'bigint'})
    startDate: number;

    @Column({name: 'url_on_event'})
    urlOnEvent!: string;
}
