import { AdvertEntity } from "src/advert/entities/advert.entity";
import { CategoryEntity } from "src/category/entities/category.entity";
import { TimestampEntity } from "src/generic/timestamp.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity  extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true,
    })
    name: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => AdvertEntity, advert => advert.user)
    adverts: AdvertEntity[];

    @OneToMany(() => CategoryEntity, category => category.user)
    categories: CategoryEntity[];
}
