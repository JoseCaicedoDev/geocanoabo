<template>
  <aside v-if="menuVisible" class="bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark col-start-1 col-end-2 relative font-semibold text-lg transition-all duration-300 flex flex-col text-text dark:text-text-dark">
    <!-- Aquí va el menú principal (sidebar) -->
    <div class="flex-1 flex items-center justify-center text-muted dark:text-muted-dark">{{ t('menu') }} lateral</div>
    <!-- Botón para ocultar/mostrar menú -->
    <button v-if="!menuPinned"
      @click="menuVisible = false"
      class="absolute top-1/2 right-0 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-l-xl flex items-center justify-center focus:outline-none"
      style="transform: translateY(-50%); width:1rem; height:5rem;"
      title="Ocultar menú"
      aria-label="Ocultar menú">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5l8 7-8 7" />
      </svg>
    </button>
  </aside>
</template>
<script setup>
import { inject } from 'vue'
const t = inject('t', k => k)
const menuVisible = defineModel('menuVisible')
const menuPinned = defineModel('menuPinned')
</script>
