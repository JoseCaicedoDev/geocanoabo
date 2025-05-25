<template>
  <aside :class="['bg-gray-100 h-full transition-all duration-300', expanded ? 'w-64' : 'w-16']">
    <div class="flex flex-col h-full">
      <button @click="toggleSidebar" class="my-4 mx-auto text-xl">
        <span v-if="expanded">⬅️</span>
        <span v-else>➡️</span>
      </button>
      <div v-if="expanded" class="px-4">
        <p class="font-semibold mb-2">Menú lateral</p>
        <!-- Aquí puedes agregar opciones del menú -->
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
const expanded = ref(true)
function toggleSidebar() {
  expanded.value = !expanded.value
}
</script>
