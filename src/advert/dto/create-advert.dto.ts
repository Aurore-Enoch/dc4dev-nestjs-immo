import { CategoryEntity } from "src/category/entities/category.entity";

export class CreateAdvertDto {
    title: string;
    description: string;
    price: number;
    nb_rooms: number;
    category: CategoryEntity;
}
