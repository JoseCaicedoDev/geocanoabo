<script setup>
import { onMounted, watch, toRefs } from 'vue'
import L from 'leaflet'

const props = defineProps({
  map: { type: Object, required: true }
})
const emit = defineEmits(['suelo-ready'])
const { map } = toRefs(props)

onMounted(() => {
  if (!map.value) return

  // Capas base
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  })
  // Overlays
  const wmsPerimetro = L.tileLayer.wms('http://geoserver.gira360.com:8080/geoserver/canoabo/wms', {
    layers: 'canoabo:pg_perimetro',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })
  const wmsRios = L.tileLayer.wms('http://geoserver.gira360.com:8080/geoserver/canoabo/wms', {
    layers: 'canoabo:pg_rios_ur',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })
  const wmsEmbalse = L.tileLayer.wms('http://geoserver.gira360.com:8080/geoserver/canoabo/wms', {
    layers: 'canoabo:pg_embalse_ur',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })
  const wmsSuelo = L.tileLayer.wms('http://geoserver.gira360.com:8080/geoserver/canoabo/wms', {
    layers: 'canoabo:pg_Suelo8_ur',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })

  // Solo la base por defecto se agrega al mapa
  esriSat.addTo(map.value)
  wmsPerimetro.addTo(map.value)

  const baseLayers = {
    "OpenStreetMap": osm,
    "Esri Satelital": esriSat
  }
  const overlays = {
    "Perímetro Canoabo": wmsPerimetro,
    "Ríos": wmsRios,
    "Embalse": wmsEmbalse,
    "Suelo": wmsSuelo
  }
  L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map.value)

  // Emitir la capa de suelo para los popups
  emit('suelo-ready', wmsSuelo)
})
</script>
