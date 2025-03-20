import { Discount } from './discount';
import { Media } from './media';
import { Model } from './model';
import { Wig } from './wig';

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

export interface ProductFilters {
  q?: string;
  category?: string;
  order?: string;
  sort?: string;
  color?: string;
  length?: Wig.Length['id'] | Wig.Length['value'];
  style?: string;
  cat?: string;
}
