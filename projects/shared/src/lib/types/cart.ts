import { Media } from './media';
import { Wig } from './wig';

export interface CartItem {
  id: Wig['id'];
  name: string;
  quantity: string;
  price: number;
  thumbnail: Media;
}
