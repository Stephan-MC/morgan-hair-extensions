import { Model } from './model';

export interface Media extends Model {
  filename: string;
  extension: string;
  variant_name: string | null;
  mime_type: string;
  aggregate_type: string;
  url: string;
  size: number;
  original_media_id: string | null;
  alt: string;
  variants: Array<Omit<Media, 'variants'>>;
}
