import { AdvertEntity } from "src/advert/entities/advert.entity";
import { TimestampEntity } from "src/generic/timestamp.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("category")
export class CategoryEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => AdvertEntity, advert => advert.category)
    adverts: AdvertEntity[];

    @ManyToOne(() => UserEntity, user => user.categories)
    user: UserEntity;

}
