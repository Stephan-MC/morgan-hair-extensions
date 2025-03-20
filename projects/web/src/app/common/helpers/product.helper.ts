import { CartItem } from '../stores/cart.store';
import { DiscountType } from '../types/discount';
import { Product } from '../types/product';
import { CartStore } from '../stores/cart.store';
import { Wig } from '../types/wig';

export class ProductHelper {
  constructor(private product: CartItem | Product | Wig) {}
  hasDiscount() {
    return this.product.discounts.length > 0 && this.activeDiscount();
  }

  activeDiscount() {
    return this.product.discounts.find((discount) => discount.is_active);
  }

  discountedPrice() {
    if (this.activeDiscount() == undefined) return this.product.price;

    if (this.activeDiscount()!.type === DiscountType.PERCENTAGE) {
      return ((100 - this.activeDiscount()!.value) * this.product.price) / 100;
    } else {
      return this.product.price - this.activeDiscount()!.value;
    }
  }

  canBeAddedToCart(cart: InstanceType<typeof CartStore>, item: Wig | Product) {
    if (cart.has(item)) {
      return item.stock > cart.entityMap()[item.id].quantity;
    }

    return item.stock > 0;
  }
}
