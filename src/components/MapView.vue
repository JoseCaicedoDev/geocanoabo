<template>
  <div class="w-full h-full min-h-[400px]">
    <MapBase @map-ready="onMapReady" />
    <MapLayers v-if="map" :map="map" @suelo-ready="onSueloReady" @layers-visibility="onLayersVisibility" />
    <MapPopupSuelo v-if="map && sueloLayer" :map="map" :sueloLayer="sueloLayer" />
    <MapScale v-if="map" :map="map" />
    <MapCoords v-if="map" :map="map" />
  </div>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'
import MapBase from './map/MapBase.vue'
import MapLayers from './map/MapLayers.vue'
import MapPopupSuelo from './map/MapPopupSuelo.vue'
import MapScale from './map/MapScale.vue'
import MapCoords from './map/MapCoords.vue'

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
