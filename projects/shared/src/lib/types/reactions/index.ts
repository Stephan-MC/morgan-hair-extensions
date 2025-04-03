import { Model } from '../model';
import { Client } from '../user';

export interface Reaction extends Model {
  reacter: {
    reacterable: Client;
  };
}
