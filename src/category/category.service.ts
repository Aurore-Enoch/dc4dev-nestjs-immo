import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateAdvertDto } from 'src/advert/dto/create-advert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { QueriesCategoryDTO } from './dto/queries-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  create(createCategoryDto: CreateCategoryDto, user) {
   console.log("createCategoryDto : ", createCategoryDto);
    const category = {
      ...createCategoryDto,
      user: {
        id: user.id
      }
    }
    
    try {
      return this.categoryRepository.save(category);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(queries: QueriesCategoryDTO) {
    let page = 1
    let limit = 2
    let offset = 0

    if(queries.page) page = parseInt(queries.page);
    if(queries.limit) limit = parseInt(queries.limit);
  
    let queryBuilder = this.categoryRepository.createQueryBuilder("category")

    offset = (page - 1) * limit

    queryBuilder
          .limit(limit)
          .offset()

    const [categoryList, totalCount] = await queryBuilder.getManyAndCount()
    
    return {
      data: categoryList,
      totalCount: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page: page,
    }
  }

  findOne(id: number) {
    const queryBuilder = this.categoryRepository.createQueryBuilder("category")
      .leftJoinAndSelect("category.user", "user")
      .where("category.id = :id", { id: id })

    return queryBuilder.getOne();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user) {
    const category = await this.findOne(id);

    this.checkIfUserIsOwner(category, user);

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number, user) {
    const category = await this.findOne(id);
   
    this.checkIfUserIsOwner(category, user);
    return this.categoryRepository.softDelete(id);
  }

  checkIfUserIsOwner(category, user) {
    if(category.user.id!== user.id) throw new UnauthorizedException("You are not the owner of this advert")
  }
}
