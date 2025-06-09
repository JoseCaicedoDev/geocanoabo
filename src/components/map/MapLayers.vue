<script setup>
import { onMounted, watch, toRefs } from 'vue'
import L from 'leaflet'
import { OSM_TILE_URL, OSM_ATTRIBUTION, ESRI_SAT_URL, GEOSERVER_WMS_URL } from '../../urls.js'

const props = defineProps({
  map: { type: Object, required: true }
})
const emit = defineEmits(['suelo-ready'])
const { map } = toRefs(props)

onMounted(() => {
  if (!map.value) return

  // Capas base
  const osm = L.tileLayer(OSM_TILE_URL, {
    attribution: OSM_ATTRIBUTION
  })
  const esriSat = L.tileLayer(ESRI_SAT_URL, {
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
  const wmsPerimetro = L.tileLayer.wms(GEOSERVER_WMS_URL, {
    layers: 'canoabo:pg_perimetro',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })
  const wmsRios = L.tileLayer.wms(GEOSERVER_WMS_URL, {
    layers: 'canoabo:pg_rios_ur',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })
  const wmsEmbalse = L.tileLayer.wms(GEOSERVER_WMS_URL, {
    layers: 'canoabo:pg_embalse_ur',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360',
  })
  const wmsSuelo = L.tileLayer.wms(GEOSERVER_WMS_URL, {
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
  const layersControl = L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map.value)

  // Estado de visibilidad de capas
  const visibility = {
    perimetro: map.value.hasLayer(wmsPerimetro),
    rios: map.value.hasLayer(wmsRios),
    embalse: map.value.hasLayer(wmsEmbalse),
    suelo: map.value.hasLayer(wmsSuelo)
  }
  function emitVisibility() {
    emit('layers-visibility', { ...visibility })
  }
  // Inicial
  emitVisibility()
  // Listeners para cambios en overlays
  map.value.on('overlayadd', function(e) {
    if (e.layer === wmsPerimetro) visibility.perimetro = true
    if (e.layer === wmsRios) visibility.rios = true
    if (e.layer === wmsEmbalse) visibility.embalse = true
    if (e.layer === wmsSuelo) visibility.suelo = true
    emitVisibility()
  })
  map.value.on('overlayremove', function(e) {
    if (e.layer === wmsPerimetro) visibility.perimetro = false
    if (e.layer === wmsRios) visibility.rios = false
    if (e.layer === wmsEmbalse) visibility.embalse = false
    if (e.layer === wmsSuelo) visibility.suelo = false
    emitVisibility()
  })

  // Elimina cualquier control de escala nativo de Leaflet (si existe)
  // (No agregar L.control.scale() en ninguna parte)

  // Control personalizado de escala tipo '1:xxxxx'
  const scaleControl = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-control leaflet-scale-custom');
      container.style.background = '#fff';
      container.style.padding = '3px 12px';
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.10)';
      container.style.fontSize = '13px';
      container.style.color = '#222';
      function updateScale() {
        // Calcular escala fraccionaria 1:xxxxx
        // Tomar el centro del mapa y calcular la resolución en metros/pixel
        const center = map.getCenter();
        const zoom = map.getZoom();
        // 256 px es el tamaño de tile base en Leaflet
        const lat = center.lat * Math.PI / 180;
        const metersPerPixel = 40075016.686 * Math.abs(Math.cos(lat)) / Math.pow(2, zoom + 8);
        // Suponiendo pantalla estándar (96 dpi)
        // 1 pulgada = 0.0254 m, 1 pixel ≈ 0.0002646 m
        // Escala = (tamaño físico de pixel en el mundo real) / (tamaño de pixel en pantalla)
        // Escala = (metros/pixel) / (0.0002646)
        const scale = Math.round(metersPerPixel / 0.0002646);
        // Redondear a múltiplos estándar
        function roundScale(val) {
          if (val < 1000) return Math.round(val/10)*10;
          if (val < 10000) return Math.round(val/100)*100;
          if (val < 100000) return Math.round(val/1000)*1000;
          return Math.round(val/10000)*10000;
        }
        container.innerHTML = `<span style='font-family:monospace;'>Escala 1:${roundScale(scale).toLocaleString('es-ES')}</span>`;
      }
      map.on('zoomend moveend', updateScale);
      setTimeout(updateScale, 200);
      return container;
    }
  });
  map.value.addControl(new scaleControl());

  // Emitir la capa de suelo para los popups
  emit('suelo-ready', wmsSuelo)
})
</script>
