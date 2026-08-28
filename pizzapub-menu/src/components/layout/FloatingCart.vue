<script setup lang="ts">
import { computed } from 'vue';
import { ShoppingBag, ArrowRight } from 'lucide-vue-next';
import { formatCurrency } from '../../utils/format';

const props = defineProps<{
  totalItems: number;
  totalPrice: number;
}>();

defineEmits<{
  (e: 'checkout'): void;
}>();

const isVisible = computed(() => props.totalItems > 0);
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="fixed bottom-4 left-4 right-4 z-50">
      <div class="bg-pub-surface/95 backdrop-blur-md border border-brand-orange/30 p-3.5 rounded-card shadow-flame flex items-center justify-between">
        
        <div class="flex items-center gap-3">
          <div class="bg-flame-gradient text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm relative">
            <ShoppingBag :size="22" stroke-width="2.5" />
            <span class="absolute -top-1.5 -right-1.5 bg-brand-yellow text-pub-bg text-xs font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-pub-surface">
              {{ totalItems }}
            </span>
          </div>
          <div>
            <p class="text-xs text-text-silver">Total do pedido</p>
            <p class="text-brand-yellow font-black text-lg">{{ formatCurrency(totalPrice) }}</p>
          </div>
        </div>

        <button 
          @click="$emit('checkout')"
          class="bg-flame-gradient hover:opacity-95 text-white font-bold px-4 py-2.5 rounded-button shadow-flame active:scale-95 transition-all text-sm flex items-center gap-2"
        >
          <span>Ver Sacola</span>
          <ArrowRight :size="18" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(120%);
}
</style>
