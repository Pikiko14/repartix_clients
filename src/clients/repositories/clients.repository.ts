import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { ClientsEntity } from '../entities/clients.entity';
import { UpdateClientsDto } from '../dto/update-clients.dto';
import { CreateClientsDto } from '../dto/create-clients.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Clients, ClientsDocument } from '../schemas/clients.schema';
import { IClientsRepository } from 'src/commons/interfaces/respository.interface';
import { PaginationResponseInterface } from 'src/commons/interfaces/response.interface';

@Injectable()
export class ClientsRepository implements IClientsRepository {
  constructor(@InjectModel(Clients.name) private readonly model: Model<Clients>) {}

  async create(createClientsDto: CreateClientsDto): Promise<ClientsEntity | unknown> {
    try {
      return (await this.model.create(createClientsDto)) as any;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async find(params: {
    key: keyof ClientsEntity | any;
    value: any;
  }): Promise<ClientsEntity | null> {
    try {
      return await this.model.findOne({ [params.key]: params.value });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async update(
    id: string | number,
    user: ClientsEntity | UpdateClientsDto,
  ): Promise<ClientsEntity | null> {
    try {
      return await this.model.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async delete(id: string, parent: string): Promise<void> {
    try {
      return await this.model.findOneAndDelete({ _id: id, parent_id: parent });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * Paginate clients
   * @param query - Query object for filtering results
   * @param skip - Number of documents to skip
   * @param perPage - Number of documents per page
   * @param sortBy - Field to sort by (default: "name")
   * @param order - Sort order (1 for ascending, -1 for descending, default: "1")
   */
  public async paginate(
    query: Record<string, any>,
    skip: number,
    perPage: number,
    fields: string[] = [
      '_id',
      'name',
      'last_name',
      'dni',
      'address',
      'phone',
      'email',
      'coords',
    ],
  ): Promise<PaginationResponseInterface> {
    try {
      // Fetch paginated data
      const users = await this.model
        .find(query)
        .select(fields.length > 0 ? fields.join(' ') : '')
        .skip(skip)
        .limit(perPage);

      // Get total count of matching documents
      const totalUsers = await this.model.countDocuments(query);

      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / perPage);

      return {
        data: users,
        totalPages,
        totalItems: totalUsers,
      };
    } catch (error: any) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async valideClientByDni(
    parent_id: string,
    dni: string | number,
  ): Promise<ClientsDocument | void> {
    return await this.model.findOne({ parent_id, dni });
  }
}
