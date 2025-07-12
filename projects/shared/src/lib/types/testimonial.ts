import { Comment } from './comment';
import { Model } from './model';
import { Reaction } from './reactions';
import { Client } from './user';

export interface Testimonial extends Model {
  client: Client;
  comment: Comment;
  reactions: Array<Reaction>
}
