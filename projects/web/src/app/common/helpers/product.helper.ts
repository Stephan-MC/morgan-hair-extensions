import { CartProduct } from '../stores/cart.store';
import { DiscountType } from '../types/discount';
import { Product } from '../types/product';

export class ProductHelper {
  constructor(private product: CartProduct | Product) {}
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
}
