import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsController } from './clients.controller';
import { Clients, ClientsSchema } from './schemas/clients.schema';
import { CacheServiceModule } from 'src/commons/cache/cache.module';
import { ClientsRepository } from './repositories/clients.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Clients.name,
        schema: ClientsSchema,
      },
    ]),
    CacheServiceModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
