import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvertEntity } from './entities/advert.entity';
import { Repository } from 'typeorm';
import { QueriesAdvertDTO } from './dto/queries-advert.dto';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(AdvertEntity)
    private readonly advertRepository: Repository<AdvertEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

  ) {}

  async create(createAdvertDto: CreateAdvertDto, user) {
    console.log("create advert => user: ", user);
    
    const advert = {
      ...createAdvertDto,
      user: {
        id: user.id
      },
    }
    
    try {
      return this.advertRepository.save(advert);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(queries: QueriesAdvertDTO) {
    let max_price: number
    let min_rooms: number
    let min_surface: number
    let max_surface: number
    let page = 1
    let limit = 2
    let offset = 0

    // Convert to int
    if (queries.max_price) max_price = parseInt(queries.max_price);
    if (queries.min_rooms) min_rooms = parseInt(queries.min_rooms);
    if (queries.min_surface) min_surface = parseInt(queries.min_surface);
    if (queries.max_surface) max_surface = parseInt(queries.max_surface);
    if(queries.page) page = parseInt(queries.page);
    if(queries.limit) limit = parseInt(queries.limit);

    // SELECT * from advert WHERE price <= max_price AND nb_rooms >= min_rooms
    let queryBuilder = this.advertRepository.createQueryBuilder("advert")

    if(max_price && max_price > 0) {
      queryBuilder.andWhere("advert.price <= :max_price", { max_price: max_price })
    }

    if(min_rooms && min_rooms > 0) {
      queryBuilder.andWhere("advert.nb_rooms >= :min_rooms", { min_rooms: min_rooms })
    }

    if(min_surface && min_surface > 0) {
      queryBuilder.andWhere("advert.surface >= :min_surface", { min_surface: min_surface })
    }

    if(max_surface && max_surface > 0) {
      queryBuilder.andWhere("advert.surface <= :max_surface", { max_surface: max_surface })
    }

    queryBuilder.leftJoinAndSelect("advert.category", "category")
    queryBuilder.leftJoinAndSelect("advert.user", "user")

    offset = (page - 1) * limit

    queryBuilder
          .limit(limit)
          .offset()

    const [advertList, totalCount] = await queryBuilder.getManyAndCount()
    
    return {
      data: advertList,
      totalCount: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page: page,
    }
  }

  findOne(id: number) {
    const queryBuilder = this.advertRepository.createQueryBuilder("advert")
      .leftJoinAndSelect("advert.user", "user")
      .leftJoinAndSelect("advert.category", "category")
      .where("advert.id = :id", { id: id })

    return queryBuilder.getOne();
  }

  async update(id: number, updateAdvertDto: UpdateAdvertDto, user) {
    const adver = await this.findOne(id);

    this.checkIfUserIsOwner(adver, user);

    return this.advertRepository.update(id, updateAdvertDto);
  }

  checkIfUserIsOwner(advert, user) {
    if(advert.user.id!== user.id) throw new UnauthorizedException("You are not the owner of this advert")
  }

  async remove(id: number, user) {
    const adver = await this.findOne(id);

    this.checkIfUserIsOwner(adver, user);

    return this.advertRepository.softDelete(id);
  }
}
