import { Model } from './model';
import { Client } from './user';

export interface Comment extends Model {
  client: Client;
  body: string;
}
