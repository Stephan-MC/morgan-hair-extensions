import { Comment } from './comment';
import { Model } from './model';
import { Client } from './user';

export interface Testimonial extends Model {
  client: Client;
  comment: Comment;
}
