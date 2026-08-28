<script setup lang="ts">
import { ref, computed } from 'vue';
import TopHeader from '../components/layout/TopHeader.vue';
import CategoryTabs from '../components/ui/CategoryTabs.vue';
import ProductCard from '../components/ui/ProductCard.vue';
import FloatingCart from '../components/layout/FloatingCart.vue';
import { products, type Product } from '../services/mockData';
import { useCart } from '../composables/useCart';

const activeCategoryId = ref('pizzas');
const { addToCart, totalItems, totalPrice } = useCart();

const filteredProducts = computed(() => {
  return products.filter(p => p.categoryId === activeCategoryId.value);
});

const handleCategorySelect = (id: string) => {
  activeCategoryId.value = id;
};

const handleAddToCart = (product: Product) => {
  addToCart(product);
};

const goToCheckout = () => {
  console.log('Indo para o checkout...');
  // Futuramente: router.push('/checkout')
};
</script>

<template>
  <div class="min-h-screen bg-pub-bg pb-24">
    <TopHeader />
    
    <main class="max-w-screen-md mx-auto">
      <div class="pt-2 pb-1 px-4">
        <h2 class="text-2xl font-extrabold text-white mt-4 mb-1">Menu Principal</h2>
        <p class="text-text-gray text-sm">Escolha suas especialidades feitas no forno a lenha.</p>
      </div>

      <CategoryTabs 
        :activeCategoryId="activeCategoryId"
        @select="handleCategorySelect"
      />

      <div class="px-4 py-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id"
          :product="product"
          @add="handleAddToCart"
        />
        
        <div v-if="filteredProducts.length === 0" class="col-span-2 py-10 text-center text-text-gray">
          Nenhum produto encontrado nesta categoria.
        </div>
      </div>
    </main>

    <FloatingCart 
      :totalItems="totalItems"
      :totalPrice="totalPrice"
      @checkout="goToCheckout"
    />
  </div>
</template>
