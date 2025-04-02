import { Comment } from './comment';
import { Model } from './model';
import { Client } from './user';

export interface Review extends Model {
  client: Client;
  comment: Comment;
  rating: number;
}
