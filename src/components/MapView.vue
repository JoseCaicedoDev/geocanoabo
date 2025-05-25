<template>
  <div class="w-full h-full min-h-[400px]">
    <MapBase @map-ready="onMapReady" />
    <MapLayers v-if="map" :map="map" @suelo-ready="onSueloReady" />
    <MapPopupSuelo v-if="map && sueloLayer" :map="map" :sueloLayer="sueloLayer" />
    <MapScale v-if="map" :map="map" />
    <MapCoords v-if="map" :map="map" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapBase from './map/MapBase.vue'
import MapLayers from './map/MapLayers.vue'
import MapPopupSuelo from './map/MapPopupSuelo.vue'
import MapScale from './map/MapScale.vue'
import MapCoords from './map/MapCoords.vue'

const map = ref(null)
const sueloLayer = ref(null)

function onMapReady(m) {
  map.value = m
}

function onSueloReady(layer) {
  sueloLayer.value = layer
}
</script>
