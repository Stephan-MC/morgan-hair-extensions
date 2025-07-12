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
  // reactant_id: number;
  // reacter_id: number;
  reacter: {
    reacterable: Client;
  };
  type: {
    name: ReactionType;
    mass: number;
  } & Omit<Model, 'id'>;
}
