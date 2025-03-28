import { Model } from './model';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export interface Discount extends Model {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  is_active: boolean;
  reccurent: boolean;
  start_date: string;
  end_date: string;
}
