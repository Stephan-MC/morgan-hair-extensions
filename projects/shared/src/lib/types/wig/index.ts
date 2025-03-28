import { Model } from '../model';
import * as color from './color';
import * as texture from './texture';
import * as lace from './lace';
import * as hair_type from './hair_type';
import * as length from './length';
import * as source from './source';
import type { Discount } from '../discount';
import type { Media } from '../media';

export namespace Wig {
  export interface Color extends color.Color {}
  export interface Length extends length.Length {}
  export interface Source extends source.Source {}
  export interface Texture extends texture.Texture {}
  export interface Lace extends lace.Lace {}
  export interface HairType extends hair_type.HairType {}
}

export interface Wig extends Model {
  name: string;
  slug: string;
  description: string;
  featured: string;
  liked: boolean;
  price: number;
  stock: number;

  thumbnail: Media;
  gallery: Array<Media>;

  discounts: Array<Discount>;
  hair_type: Wig.HairType;
  color: Wig.Color;
  lace: Wig.Lace;
  length: Wig.Length;
  source: Wig.Source;
  texture: Wig.Texture;
}

export interface WigFilter {
  /** The query string. used to filter wigs by name */
  q?: string;

  /** The Color code, name or id used to filter wigs */
  color?: Wig.Color['name'] | Wig.Color['id'] | Wig.Color['code'];

  hair_type?: Wig.HairType['name'] | Wig.HairType['id'];

  lace?: Wig.Lace['name'] | Wig.Lace['id'];

  length?: Wig.Length['id'] | Wig.Length['value'];

  source?: Wig.Source['name'] | Wig.Source['id'];

  texture?: Wig.Texture['name'] | Wig.Texture['id'];

  page?: number;

  /** Indicates whether only the featured products should be selected or not */
  featured?: boolean;
}
