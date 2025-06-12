<template>
  <div class="w-full h-full min-h-[400px]">
    <MapBase @map-ready="onMapReady" />
    <div class="w-full h-full flex">
      <AtributosSuelo
        class="w-1/3 h-full"
        :selectedId="selectedFeatureId"
        @select-feature="emit('select-feature', $event)"
      />
      <div class="w-2/3 h-full">
        <MapLayers
          v-if="map"
          :map="map"
          :selectedFeatureId="selectedFeatureId"
          :filterTextura="filterTextura"
          @suelo-ready="onSueloReady"
          @layers-visibility="onLayersVisibility"
        />
        <MapPopupSuelo v-if="map && sueloLayer" :map="map" :sueloLayer="sueloLayer" />
        <MapScale v-if="map" :map="map" />
        <MapCoords v-if="map" :map="map" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'
import MapBase from './map/MapBase.vue'
import MapLayers from './map/MapLayers.vue'
import MapPopupSuelo from './map/MapPopupSuelo.vue'
import MapScale from './map/MapScale.vue'
import MapCoords from './map/MapCoords.vue'
import AtributosSuelo from './layout/AtributosSuelo.vue'

const props = defineProps({
  selectedFeatureId: { type: [String, Number], default: null },
  filterTextura: { type: String, default: null }
})
const emit = defineEmits(['select-feature'])

const map = ref(null)
const sueloLayer = ref(null)
const activeLayers = reactive({
  perimetro: true,
  rios: false,
  embalse: false,
  suelo: true
})

function onMapReady(m) {
  map.value = m
}

function onSueloReady(layer) {
  sueloLayer.value = layer
}

function onLayersVisibility(visibility) {
  activeLayers.perimetro = visibility.perimetro
  activeLayers.rios = visibility.rios
  activeLayers.embalse = visibility.embalse
  activeLayers.suelo = visibility.suelo
}

provide('activeLayers', activeLayers)
</script>
