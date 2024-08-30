import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto'; 
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);
  
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }
 
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll( paginationDto : PaginationDto) {

    const { page, limit } = paginationDto;

    const total = await this.product.count({where : {deleted_at: null}});
    const lastPage = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          deleted_at: null
        }
      }),
      meta: {
        total,
        page,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id, deleted_at: null
      }
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: _, ...data } = updateProductDto;
    
    await this.findOne(id);

    return await this.product.update({
      where: {
        id
      },
      data: updateProductDto
    });

  }

  async remove(id: number) {

    await this.findOne(id);

    return await this.product.update({
      where: {
        id
      },
      data: {
        deleted_at: new Date()
      }
    });

  }
}
