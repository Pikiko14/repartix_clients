import { Controller } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientsDto } from './dto/create-clients.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { DeleteClientsDto } from './dto/delete-clients.dto';
import { QueryParamDto } from 'src/commons/dto/query-param.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @MessagePattern('create-client')
  create(@Payload() createClientsDto: CreateClientsDto) {
    return this.clientsService.create(createClientsDto);
  }

  @MessagePattern('find-all-client')
  findAll(queryParams: QueryParamDto) {
    return this.clientsService.findAll(queryParams);
  }

  @MessagePattern('update-client')
  update(@Payload() updateClientsDto: UpdateClientsDto) {
    return this.clientsService.update(updateClientsDto.id, updateClientsDto);
  }

  @MessagePattern('remove-client')
  remove(@Payload() deleteClientsDto: DeleteClientsDto) {
    return this.clientsService.remove(deleteClientsDto);
  }
}
