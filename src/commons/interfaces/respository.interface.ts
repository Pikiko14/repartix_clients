import { ClientsEntity } from './../../clients/entities/clients.entity';
import { CreateClientsDto } from './../../clients/dto/create-clients.dto';

export interface IClientsRepository {
  create(createCityDto: CreateClientsDto): Promise<ClientsEntity | unknown>;
  
  find(params: { key: keyof ClientsEntity; value: any }): Promise<ClientsEntity | null>;
  
  update(id: string, client: ClientsEntity): Promise<ClientsEntity | null>;
  
  delete(id: string, parent_id: string): Promise<void>;
}
