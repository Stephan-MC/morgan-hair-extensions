import { Discount } from './discount';
import { Media } from './media';
import { Model } from './model';

export interface Product extends Model {
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  featured: boolean;
  new: boolean;
  description: string;
  stock: number;
  price: number;
  thumbnail: Media;
  discounts: Array<Discount>;
  liked: boolean;
}
