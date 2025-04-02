import { DiscountType, Wig } from 'shared';
import { CartItem, CartStore } from '../stores/cart.store';

export class ProductHelper {
  price = 1;

  constructor(private item: CartItem | Wig) {
    this.price =
      (this.item as Wig)?.length?.price ?? (this.item as CartItem)?.price;
  }
  hasDiscount() {
    return !!this.item.discount;
  }

  discountedPrice() {
    if (!this.item.discount) return this.price;

    if (this.item.discount!.type === DiscountType.PERCENTAGE) {
      return ((100 - this.item.discount!.value) * this.price) / 100;
    } else {
      return this.price - this.item.discount!.value;
    }
  }

  canBeAddedToCart(cart: InstanceType<typeof CartStore>, item: Wig) {
    return (
      (cart.has(item) && item.stock > cart.entityMap()[item.id].quantity) ||
      item.stock > 0
    );
  }
}
