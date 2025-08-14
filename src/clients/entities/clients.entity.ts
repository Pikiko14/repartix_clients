export class ClientsEntity {
  id?: number | string;
  _id?: string;
  name: string;
  last_name: string;
  dni?: number;
  address: string;
  coords: {
    lat: number;
    lng: number;
  }
  phone: string;
  email: string;
  parent_id: string;
}