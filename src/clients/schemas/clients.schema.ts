import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { truncate } from 'fs';
import { Document } from 'mongoose';

class Coords {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}

export type ClientsDocument = Clients & Document;

@Schema({ timestamps: true })
export class Clients {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  last_name: string;

  @Prop({ required: false, unique: false })
  dni: number;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Coords, required: false})
  coords: {
    lat: number;
    lng: number;
  }

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  parent_id: string;
}

export const ClientsSchema = SchemaFactory.createForClass(Clients);
