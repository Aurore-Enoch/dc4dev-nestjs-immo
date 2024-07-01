import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertDto } from './create-advert.dto';
import { CategoryEntity } from 'src/category/entities/category.entity';

export class UpdateAdvertDto extends PartialType(CreateAdvertDto) {
    title?: string;
    description?: string;
    price?: number;
    nb_rooms?: number;
    category?: CategoryEntity
}
// export class UpdateAdvertDto {
//     title: string;
//     description: string;
//     price: number;
//     nb_rooms: number;
//     category: {
//         id: number;
//         name: string;
//     }
// }
