import { Media } from './media';
import { Model } from './model';

export interface User extends Model {
  first_name: string;
  last_name: string;
  profile: Media;
  email: string;
}

export interface Client extends User {
  purchases_count: number;
  reviews_count: number;
}

export interface Admin extends User {}
