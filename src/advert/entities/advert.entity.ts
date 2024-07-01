import { CategoryEntity } from "src/category/entities/category.entity";
import { TimestampEntity } from "src/generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("advert")
export class AdvertEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    nb_rooms: number;

    @Column({ nullable: true })
    surface: number;

    @ManyToOne(() => UserEntity, user => user.adverts)
    user: UserEntity;

    @ManyToOne(() => CategoryEntity, category => category.adverts)
    category: CategoryEntity;


}
