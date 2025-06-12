<template>
  <div>
    <div v-if="loading" class="text-blue-600 py-2">Cargando datos...</div>
    <div v-if="error" class="text-red-600 py-2">{{ error }}</div>
    <div v-if="soilFeatures.length > 0">
      <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 shadow" style="max-height: 350px; overflow-y: auto;">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Nombre</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">textura</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Arcilla</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">pH</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">M.O.</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">C. USO</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="feat in soilFeatures" :key="feat.id" @click="$emit('select-feature', feat.properties.id)" :class="{ 'bg-yellow-100 dark:bg-yellow-900': String(selectedId) === String(feat.properties.id) }">
              <td class="px-4 py-2 whitespace-nowrap font-semibold text-gray-800 dark:text-gray-100">{{ feat.properties.id }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100">{{ feat.properties.nombre }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100">{{ feat.properties.h1_text }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100">{{ feat.properties.h1_arci }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100">{{ feat.properties.h1_ph }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100">{{ feat.properties.h1_mo }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100">{{ feat.properties.cuso }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-xs text-gray-500 mt-2">Fuente: Servicio WFS GeoServer</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { GEOSERVER_WFS_SUELO_URL } from '../../urls.js'
const emit = defineEmits(["soil-features-update"])
const props = defineProps({ selectedId: { type: [String, Number], default: null } })
console.log('selectedId prop:', props.selectedId)
const soilFeatures = ref([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const url = GEOSERVER_WFS_SUELO_URL
    const res = await fetch(url)
    if (!res.ok) throw new Error('Error al obtener datos WFS')
    const geojson = await res.json()
    soilFeatures.value = geojson.features || []
    // Emitir los datos al padre (Sidebar)
    emit('soil-features-update', soilFeatures.value)
  } catch (e) {
    error.value = e.message || 'Error desconocido'
    soilFeatures.value = []
    emit('soil-features-update', [])
  } finally {
    loading.value = false
  }
})
</script>
