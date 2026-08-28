import { ref, computed } from 'vue';
import type { Product } from '../services/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

const items = ref<CartItem[]>([]);

export function useCart() {
  const addToCart = (product: Product) => {
    const existing = items.value.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ product, quantity: 1 });
    }
  };

  const totalItems = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  return {
    items,
    addToCart,
    totalItems,
    totalPrice
  };
}
