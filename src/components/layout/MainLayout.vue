<template>
  <section :class="['row-start-2 row-end-3 col-span-1 h-full grid', menuVisible ? 'grid-cols-[minmax(220px,25%)_1fr]' : 'grid-cols-1', 'bg-background dark:bg-background-dark']">
    <Sidebar
      v-model:menuVisible="menuVisible"
      v-model:menuPinned="menuPinned"
      :selectedFromMapId="selectedFromMapId"
      :selectedFromTableId="selectedFromTableId"
      @select-feature="onTableSelect"
      @filter-textura="onFilterTextura"
      @clear-selection="onClearSelection"
    />
    <main :class="[
      'bg-background dark:bg-background-dark w-full h-full flex-1 min-h-0 min-w-0 flex flex-col p-0 m-0 overflow-hidden relative',
      menuVisible ? 'col-start-2 col-end-3' : 'col-start-1 col-end-2'
    ]">
      <MapView
        :selectedFeatureId="selectedFromTableId"
        :filterTextura="filterTextura"
        @select-feature="onMapSelect"
      />
      <button
        v-if="!menuVisible"
        @click="menuVisible = true"
        class="absolute z-[1000] top-1/2 left-0 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-xl flex items-center justify-center focus:outline-none"
        style="transform: translateY(-50%); width:1rem; height:5rem;"
        title="Mostrar menú"
        aria-label="Mostrar menú"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 5l-8 7 8 7" />
        </svg>
      </button>
    </main>
  </section>
</template>
<script setup>
import Sidebar from './Sidebar.vue'
import MapView from '../MapView.vue'
import { ref } from 'vue'
const menuVisible = defineModel('menuVisible')
const menuPinned = defineModel('menuPinned')
const selectedFromMapId = ref(null) // Selección hecha en el mapa
const selectedFromTableId = ref(null) // Selección hecha en la tabla
const filterTextura = ref(null)

function onMapSelect(id) {
  selectedFromMapId.value = id;
  selectedFromTableId.value = null; // Limpiar selección de tabla
}
function onTableSelect(id) {
  selectedFromTableId.value = id;
  selectedFromMapId.value = null; // Limpiar selección de mapa
}
function onFilterTextura(textura) {
  filterTextura.value = textura;
}
function onClearSelection() {
  selectedFromMapId.value = null;
  selectedFromTableId.value = null;
}
</script>
