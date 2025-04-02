import { Model } from './model';
import { Review } from './review';
import { Testimonial } from './testimonial';
import { Client } from './user';

export interface Comment extends Model {
  client: Client;
  body: string;
  commentable: Review | Testimonial;
}
