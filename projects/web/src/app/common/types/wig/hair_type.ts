import { Media } from '../media';
import { Model } from '../model';

export interface HairType extends Model {
  name: string;
  thumbnail: Media;
}
