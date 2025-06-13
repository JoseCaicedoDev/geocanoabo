<template>
  <div>
    <div v-if="loading" class="text-blue-600 py-2">Cargando datos...</div>
    <div v-if="error" class="text-red-600 py-2">{{ error }}</div>
    <div v-if="soilFeatures.length > 0">
      <div class="mb-3 flex items-center">
        <span class="relative w-full">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar en los atributos..."
            class="w-full pl-9 pr-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <svg class="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
      <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 shadow" style="max-height: 350px; overflow-y: auto;">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
  v-for="col in columns"
  :key="col.key"
  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider select-none cursor-pointer group"
  @click="sortBy(col.key)"
>
  <span class="flex items-center">
    <span>{{ col.label }}</span>
    <span class="flex flex-col justify-center ml-1">
      <svg v-if="sortColumn === col.key && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
      <svg v-if="sortColumn === col.key && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      <span v-if="sortColumn !== col.key" class="opacity-30 group-hover:opacity-60 transition flex">
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </span>
    </span>
  </span>
</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="feat in sortedFeatures" :key="feat.properties.id" @click="$emit('select-feature', feat.properties.id)" :class="{ 'bg-yellow-100 dark:bg-yellow-900 font-bold selected-row': isSelectedRow(feat.properties.id) }">
  <td v-for="col in columns" :key="col.key" class="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100" :class="col.key === 'id' ? 'font-semibold' : ''">
    {{ feat.properties[col.prop] }}
  </td>
</tr>
          </tbody>
        </table>
      </div>
      <div class="text-xs text-gray-500 mt-2">Fuente: Servicio WFS GeoServer</div>
      <button
        class="mt-3 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        @click="$emit('clear-selection')"
      >
        Limpiar selección
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { GEOSERVER_WFS_SUELO_URL } from '../../urls.js'
const emit = defineEmits(["soil-features-update"])
const props = defineProps({
  selectedFromMapId: { type: [String, Number], default: null },
  selectedFromTableId: { type: [String, Number], default: null }
})
const soilFeatures = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')

const columns = [
  { key: 'id', label: 'ID', prop: 'id' },
  { key: 'nombre', label: 'Nombre', prop: 'nombre' },
  { key: 'h1_text', label: 'Textura', prop: 'h1_text' },
  { key: 'h1_arci', label: 'Arcilla', prop: 'h1_arci' },
  { key: 'h1_ph', label: 'pH', prop: 'h1_ph' },
  { key: 'h1_mo', label: 'M.O.', prop: 'h1_mo' },
  { key: 'cuso', label: 'C. USO', prop: 'cuso' },
]

const sortColumn = ref(null)
const sortOrder = ref('asc')

function sortBy(key) {
  if (sortColumn.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = key
    sortOrder.value = 'asc'
  }
}

const filteredFeatures = computed(() => {
  if (!search.value) return soilFeatures.value
  const lowerSearch = search.value.toLowerCase()
  return soilFeatures.value.filter(feat => {
    return columns.some(col => {
      const value = feat.properties[col.prop]
      return String(value).toLowerCase().includes(lowerSearch)
    })
  })
})

const sortedFeatures = computed(() => {
  if (!sortColumn.value) return filteredFeatures.value
  const col = columns.find(c => c.key === sortColumn.value)
  if (!col) return filteredFeatures.value
  return [...filteredFeatures.value].sort((a, b) => {
    const aVal = a.properties[col.prop]
    const bVal = b.properties[col.prop]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    }
    return sortOrder.value === 'asc'
      ? String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      : String(bVal).localeCompare(String(aVal), undefined, { numeric: true })
  })
})

function isSelectedRow(rowId) {
  return String(props.selectedFromMapId).trim() === String(rowId).trim() ||
         String(props.selectedFromTableId).trim() === String(rowId).trim();
}

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

<style scoped>
.selected-row {
  background: #ffe066 !important;
  font-weight: bold !important;
}
.selected-row.dark,
.dark .selected-row {
  background: #7c4a03 !important; /* Marrón visible en modo dark */
  color: #fff !important;
}
</style>
