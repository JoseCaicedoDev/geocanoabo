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

  // Botón tipo home para zoom al extent general (solo una vez)
  if (!map.value._homeControlAdded) {
    const homeControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.background = '#fff';
        container.style.width = '36px';
        container.style.height = '36px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.cursor = 'pointer';
        container.title = 'Zoom a extensión general';
        container.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        container.onmousedown = container.ondblclick = L.DomEvent.stopPropagation;
        container.onclick = function(e) {
          // Centrar el mapa en la coordenada principal con zoom 12
          map.setView([10.3369959599, -68.272687215], 12);
        };
        return container;
      }
    });
    map.value.addControl(new homeControl());
    map.value._homeControlAdded = true;
  }

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
  wmsSuelo.addTo(map.value)

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
