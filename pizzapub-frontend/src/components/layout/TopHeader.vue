<script setup lang="ts">
import { Search, Menu } from 'lucide-vue-next';
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-pub-bg/90 backdrop-blur-md border-b border-pub-border px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-flame-gradient flex items-center justify-center shadow-flame text-white font-bold">
        P
      </div>
      <h1 class="text-xl font-extrabold text-white tracking-tight">PizzaPub</h1>
    </div>
    <div class="flex items-center gap-4 text-text-silver">
      <button class="hover:text-brand-orange transition-colors">
        <Search :size="20" />
      </button>
      <button class="hover:text-brand-orange transition-colors">
        <Menu :size="20" />
      </button>
    </div>
  </header>
</template>
