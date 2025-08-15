import { RpcException } from '@nestjs/microservices';
import { ClientsEntity } from './entities/clients.entity';
import { CreateClientsDto } from './dto/create-clients.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { DeleteClientsDto } from './dto/delete-clients.dto';
import { CacheService } from 'src/commons/cache/cache.service';
import { QueryParamDto } from 'src/commons/dto/query-param.dto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientsRepository } from './repositories/clients.repository';
import { ResponseRequestInterface } from 'src/commons/interfaces/response.interface';

@Injectable()
export class ClientsService {
  constructor(
    @Inject() private repository: ClientsRepository,
    @Inject() private readonly cacheService: CacheService,
  ) {}

  /**
   * Create client
   * @param { CreateClientsDto } CreateClientsDto
   * @returns
   */
  async create(createClientsDto: CreateClientsDto) {
    try {
      await this.cacheService.removeByPrefix(
        `keyv:${createClientsDto.parent_id}:clients:list`,
      );

      // validate essit cliente
      const issetClient = await this.repository.valideClientByDni(
        createClientsDto.parent_id,
        createClientsDto.dni,
      );

      if (issetClient)
        throw new RpcException({
          message: 'client already exists',
          status: HttpStatus.BAD_REQUEST,
        });

      // creo el cliente
      const client = await this.repository.create(createClientsDto);

      // return response
      return {
        success: true,
        data: client,
        message: 'Client created successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * List clients
   * @param { QueryParamDto } queryParams
   * @returns
   */
  async findAll(
    queryParams: QueryParamDto,
  ): Promise<ResponseRequestInterface | any> {
    const cacheKey = `${queryParams.parent_id}:clients:list:${JSON.stringify(queryParams)}`;
    let clients = await this.cacheService.getItem(cacheKey);
    if (clients) {
      return {
        success: true,
        clients,
        message: 'Clients list (from cache)',
      };
    }

    try {
      let query: Record<string, any> = {
        parent_id: queryParams.parent_id,
      };

      // validamos la busqueda
      if (queryParams.search) {
        const searchRegex = new RegExp(queryParams.search as string, 'i');
        const orConditions: any[] = [
          { name: searchRegex },
          { last_name: searchRegex },
          { email: searchRegex },
        ];

        if (!isNaN(Number(queryParams.search))) {
          orConditions.push({ dni: Number(queryParams.search) });
        }

        query = {
          parent_id: queryParams.parent_id,
          $or: orConditions,
        };
      }

      // validamos la data de la paginacion
      const page = Number(queryParams.page) || 1;
      const perPage = Number(queryParams.perPage) || 7;
      const skip = (page - 1) * perPage;

      clients = await this.repository.paginate(query, skip, perPage);

      // Guardamos el resultado en cache por 10 minutos
      await this.cacheService.setItem(cacheKey, clients);

      return {
        success: true,
        clients,
        message: 'Clients list',
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async update(id: number | string, updateClientsDto: UpdateClientsDto) {
    let client = await this.repository.find({
      key: '_id',
      value: updateClientsDto.id,
    });

    if (!client)
      throw new RpcException({
        message: `Client with this id: ${updateClientsDto.id} not found`,
        status: HttpStatus.NOT_FOUND,
        error: true,
      });

    // clear cache
    await this.cacheService.removeByPrefix(
      `keyv:${updateClientsDto.parent_id}:clients:list`,
    );

    try {
      // validate if user exist with this email
      const issetClient = await this.repository.valideClientByDni(
        updateClientsDto.parent_id,
        updateClientsDto.dni,
      );
      if (issetClient && issetClient.id !== client.id)
        throw new RpcException({
          message: 'Client already exists',
          status: HttpStatus.BAD_REQUEST,
          error: true,
        });

      client = await this.repository.update(client.id, updateClientsDto);

      // return data
      return {
        success: true,
        data: client,
        message: 'Client Update Success',
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  /**
   * Delete Clients
   * @param { DeleteClientsDto } deleteClientsDto
   * @returns
   */
  async remove(deleteClientsDto: DeleteClientsDto) {
    await this.cacheService.removeByPrefix(
      `keyv:${deleteClientsDto.parent_id}:clients:list`,
    );

    let client: ClientsEntity | void = await this.repository.find({
      key: '_id',
      value: deleteClientsDto.id,
    });

    if (!client) {
      throw new RpcException({
        message: `Client with this id: ${deleteClientsDto.id} not found`,
        status: HttpStatus.NOT_FOUND,
        error: true,
      });
    }

    try {
      client = await this.repository.delete(
        deleteClientsDto.id,
        deleteClientsDto.parent_id,
      );

      // return data
      return {
        success: true,
        data: client,
        message: 'Client delete success',
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
