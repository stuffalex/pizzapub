<script setup lang="ts">
import { categories } from '../../services/mockData';

defineProps<{
  activeCategoryId: string;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<template>
  <div class="w-full overflow-x-auto no-scrollbar py-4 px-4">
    <div class="flex items-center gap-3">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="$emit('select', cat.id)"
        class="flex items-center gap-2 px-4 py-2 rounded-chip font-semibold text-sm transition-all duration-300 whitespace-nowrap border"
        :class="[
          activeCategoryId === cat.id 
            ? 'bg-flame-gradient text-white border-transparent shadow-flame' 
            : 'bg-pub-surface text-text-gray border-pub-border hover:border-brand-orange/50 hover:text-white'
        ]"
      >
        <span class="text-base">{{ cat.icon }}</span>
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
