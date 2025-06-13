<template>
  <aside v-if="menuVisible" class="bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark col-start-1 col-end-2 relative font-semibold text-lg transition-all duration-300 flex flex-col text-text dark:text-text-dark">
    <!-- Aquí va el menú principal (sidebar) -->
    <div class="flex-1 px-4 pt-4 overflow-y-auto">
      <!-- Acordeón -->
      <div class="mt-2">
        <!-- Capa -->
        <div>
          <button @click="toggleAccordion('capa')" class="w-full flex justify-between items-center py-2 px-3 bg-white dark:bg-surface-dark rounded-t-lg border border-gray-300 dark:border-border focus:outline-none">
            <span class="font-medium">Capa</span>
            <svg :class="openCapa ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="openCapa" class="px-3 py-2 bg-gray-50 dark:bg-surface-dark border-x border-b border-gray-300 dark:border-border rounded-b-lg text-sm transition-all">
            <div v-for="(label, key) in capaLabels" :key="key" class="flex items-center mb-2">
              <input type="checkbox" :id="'capa-' + key" :checked="activeLayers[key]" @change="() => toggleLayer(key)" class="mr-2" />
              <label :for="'capa-' + key">{{ label }}</label>
            </div>
          </div>
        </div>
        <!-- Leyenda -->
        <div class="mt-2">
          <button @click="toggleAccordion('leyenda')" class="w-full flex justify-between items-center py-2 px-3 bg-white dark:bg-surface-dark rounded-t-lg border border-gray-300 dark:border-border focus:outline-none">
            <span class="font-medium">Leyenda</span>
            <svg :class="openLeyenda ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="openLeyenda" class="px-3 py-2 bg-gray-50 dark:bg-surface-dark border-x border-b border-gray-300 dark:border-border rounded-b-lg text-sm transition-all">
            <!-- Leyenda visual de capas -->
            <ul class="space-y-2">
              <li v-if="activeLayers?.perimetro" class="flex items-center gap-2">
                <svg width="26" height="10"><line x1="2" y1="5" x2="24" y2="5" stroke="#ff9800" stroke-width="4"/></svg>
                <span>Perímetro</span>
              </li>
              <li v-if="activeLayers?.rios" class="flex items-center gap-2">
                <svg width="26" height="10"><line x1="2" y1="5" x2="24" y2="5" stroke="#304ffe" stroke-width="3"/></svg>
                <span>Ríos</span>
              </li>
              <li v-if="activeLayers?.embalse" class="flex items-center gap-2">
                <svg width="20" height="20"><rect x="3" y="5" width="14" height="10" fill="#5c6bc0" stroke="#222" stroke-width="2"/></svg>
                <span>Embalse</span>
              </li>
              <li v-if="activeLayers?.suelo" class="flex items-center gap-2">
                <span class="font-bold">Suelo (tipo de textura)</span>
              </li>
              <ul v-if="activeLayers?.suelo" class="ml-6 space-y-1 text-xs">
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#3b2246;border:1px solid #222;"></span>
                  <span>arenoso</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#7fb6e8;border:1px solid #222;"></span>
                  <span>areno Franco</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#36c3d1;border:1px solid #222;"></span>
                  <span>Franco</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#5bc85b;border:1px solid #222;"></span>
                  <span>Franco arenoso</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#b6d94a;border:1px solid #222;"></span>
                  <span>Franco Arcilloso</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#e7a33c;border:1px solid #222;"></span>
                  <span>Franco Arcillo arenoso</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#b8560b;border:1px solid #222;"></span>
                  <span>Franco Limoso</span>
                </li>
                <li class="flex items-center gap-2">
                  <span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#3d1c13;border:1px solid #222;"></span>
                  <span>Sin informacion</span>
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <!-- Gráfica -->
        <div class="mt-2">
          <button @click="toggleAccordion('grafica')" class="w-full flex justify-between items-center py-2 px-3 bg-white dark:bg-surface-dark rounded-t-lg border border-gray-300 dark:border-border focus:outline-none">
            <span class="font-medium">Gráfica</span>
            <svg :class="openGrafica ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="openGrafica" class="px-3 py-2 bg-gray-50 dark:bg-surface-dark border-x border-b border-gray-300 dark:border-border rounded-b-lg text-sm transition-all">
            <DoughnutSuelo v-if="soilFeatures.length > 0" :soilFeatures="soilFeatures" @filter-textura="onFilterTextura" />
            <div v-else class="text-xs text-gray-500">No hay datos de suelo disponibles</div>
          </div>
        </div>
        <!-- Atributo -->
        <div class="mt-2">
          <button @click="toggleAccordion('atributo')" class="w-full flex justify-between items-center py-2 px-3 bg-white dark:bg-surface-dark rounded-t-lg border border-gray-300 dark:border-border focus:outline-none">
            <span class="font-medium">Atributo</span>
            <svg :class="openAtributo ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="openAtributo" class="px-3 py-2 bg-gray-50 dark:bg-surface-dark border-x border-b border-gray-300 dark:border-border rounded-b-lg text-sm transition-all">
            <!-- Contenido del atributo -->
            <!-- selectedId viene directo del padre y solo se usa para resaltar la tabla -->
<!-- selectedId viene directo del padre y solo se usa para resaltar la tabla -->
<AtributosSuelo :selectedFromMapId="props.selectedFromMapId" :selectedFromTableId="props.selectedFromTableId" @select-feature="$emit('select-feature', $event)" @soil-features-update="onSoilFeaturesUpdate" @clear-selection="$emit('clear-selection')" />
          </div>
        </div>
      </div>
    </div>
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
import { inject, ref, computed } from 'vue'
import AtributosSuelo from './AtributosSuelo.vue'
import DoughnutSuelo from '../charts/DoughnutSuelo.vue'
const t = inject('t', k => k)
const menuVisible = defineModel('menuVisible')
const menuPinned = defineModel('menuPinned')
const openLeyenda = ref(false)
const openGrafica = ref(false)
const openAtributo = ref(false)
const openCapa = ref(true)
const props = defineProps({
  selectedFromMapId: { type: [String, Number], default: null },
  selectedFromTableId: { type: [String, Number], default: null }
})

const injectedLayers = inject('activeLayers', {
  perimetro: true,
  rios: false,
  embalse: false,
  suelo: true
})
const activeLayers = injectedLayers

const capaLabels = {
  perimetro: 'Perímetro Canoabo',
  rios: 'Ríos',
  embalse: 'Embalse',
  suelo: 'Suelo'
}

function toggleLayer(key) {
  if (activeLayers && key in activeLayers) {
    activeLayers[key] = !activeLayers[key]
    emit('layers-visibility', {
      perimetro: activeLayers.perimetro,
      rios: activeLayers.rios,
      embalse: activeLayers.embalse,
      suelo: activeLayers.suelo
    })
  }
}

// Compartir datos de suelo desde AtributosSuelo
const soilFeatures = ref([])
function onSoilFeaturesUpdate(features) {
  soilFeatures.value = features
}

// Propaga el filtro hacia arriba
const emit = defineEmits(['select-feature', 'filter-textura', 'soil-features-update'])
function onFilterTextura(textura) {
  emit('filter-textura', textura)
}



function toggleAccordion(section) {
  if (section === 'capa') {
    openCapa.value = !openCapa.value
    if (openCapa.value) {
      openLeyenda.value = false
      openGrafica.value = false
      openAtributo.value = false
    }
  } else if (section === 'leyenda') {
    openLeyenda.value = !openLeyenda.value
    if (openLeyenda.value) {
      openGrafica.value = false
      openAtributo.value = false
      openCapa.value = false
    }
  } else if (section === 'grafica') {
    openGrafica.value = !openGrafica.value
    if (openGrafica.value) {
      openLeyenda.value = false
      openAtributo.value = false
      openCapa.value = false
    }
  } else if (section === 'atributo') {
    openAtributo.value = !openAtributo.value
    if (openAtributo.value) {
      openLeyenda.value = false
      openGrafica.value = false
      openCapa.value = false
    }
  }
}


</script>
