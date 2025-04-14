import { Model } from '../model';
import { Client } from '../user';
import { Wig } from '../wig';

export enum ReactionType {
  RATING = 'Rating',
  LOVE = 'Love',
}

export interface Reaction extends Omit<Model, 'id'> {
  id: number;
  /** The value of the reaction */
  rate: number;
  reacter: {
    reacterable: Client;
  };
  type: {
    name: ReactionType;
    mass: 1;
  } & Omit<Model, 'id'>;
}
