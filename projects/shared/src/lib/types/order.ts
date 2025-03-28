import { CartItem } from './cart';
import { Model } from './model';
import { Client } from './user';
import { Wig } from './wig';

export interface Order extends Model {
  coordinate: {
    lat: number;
    lng: number;
  };
  status: OrderStatus;
  client: Client | null;
  email: string | null;
  contact: string | null;
  items: Array<Wig>;
}

export enum OrderStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
}

export interface OrderExtra {
  pending_count: number;
}

export interface OrderRequest {
  coordinate: Order['coordinate'];
  cart: Array<Pick<CartItem, 'id' | 'quantity'>>;
  user_id?: Client['id'];
  email: Client['email'];
}
