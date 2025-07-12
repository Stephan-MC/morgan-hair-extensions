import { Media } from './media';
import { Model } from './model';
import { Review } from './review';

export interface User extends Model {
  first_name: string;
  last_name: string;
  profile: Media;
  email: string;
}

export interface Client extends User {
  love_reacer_id: number;
  purchases_count: number;
  reviews: Array<Review>
  reviews_count: number;
}

export interface Admin extends User {}
