<script setup lang="ts">
import type { Product } from '../../services/mockData';
import { formatCurrency } from '../../utils/format';
import { Plus } from 'lucide-vue-next';

defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: 'add', product: Product): void;
}>();
</script>

<template>
  <div class="relative bg-pub-card border border-pub-border rounded-card p-3.5 flex flex-col justify-between hover:border-brand-orange/40 hover:-translate-y-1 transition-all duration-300 shadow-card group h-full">
    
    <span v-if="product.badge" class="absolute top-2 left-2 z-10 bg-brand-red text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
      {{ product.badge }}
    </span>

    <div class="w-full h-32 rounded-xl overflow-hidden mb-3 bg-pub-surface flex items-center justify-center shrink-0">
      <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>

    <div class="flex-1 flex flex-col">
      <h3 class="text-white font-bold text-base mb-1 leading-tight group-hover:text-brand-orange-light transition-colors line-clamp-2">
        {{ product.name }}
      </h3>
      <p class="text-text-gray text-xs line-clamp-2 mb-3 flex-1">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between pt-2 border-t border-pub-border/50 mt-auto">
        <span class="text-brand-yellow font-black text-lg">{{ formatCurrency(product.price) }}</span>
        
        <button 
          @click="$emit('add', product)"
          class="bg-flame-gradient hover:opacity-90 text-white font-bold px-3 py-1.5 rounded-button shadow-flame active:scale-95 transition-all flex items-center gap-1 text-sm"
        >
          <Plus :size="16" />
          Pedir
        </button>
      </div>
    </div>
  </div>
</template>
