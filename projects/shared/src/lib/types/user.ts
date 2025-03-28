import { Model } from './model';

export interface User extends Model {
  email: string;
}

export interface Client extends User {}

export interface Admin extends User {}
