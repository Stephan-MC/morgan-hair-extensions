import { Comment } from './comment';
import { Model } from './model';
import { Reaction } from './reactions';
import { Client } from './user';

// export interface ClientReview {
//   id: string;
//   rating: number;
//   body: string;
// }

export interface Review extends Model {
  client: Client;
  comment: Comment;
  rating: Reaction;
  reactions: Array<Reaction>
}

// export type Review = ReviewModel | ClientReview;
