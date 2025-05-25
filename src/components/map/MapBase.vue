<template>
  <div ref="mapContainer" class="w-full h-full min-h-[400px]"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref(null)
const emit = defineEmits(['map-ready'])
let map = null

onMounted(() => {
  map = L.map(mapContainer.value).setView([10.3369959599, -68.272687215], 12)
  emit('map-ready', map)
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.w-full { width: 100%; }
.h-full { height: 100%; }
.min-h-\[400px\] { min-height: 400px; }
</style>
