<script setup>
import { onMounted, watch, toRefs } from 'vue'
import L from 'leaflet'
import { OSM_TILE_URL, OSM_ATTRIBUTION, ESRI_SAT_URL, GEOSERVER_WMS_URL, GEOSERVER_WFS_SUELO_URL } from '../../urls.js'

// selectedFeatureId viene del padre y solo se usa para resaltar el punto en el mapa
const props = defineProps({
  map: { type: Object, required: true },
  selectedFeatureId: { type: [String, Number], default: null },
  filterTextura: { type: String, default: null }
})

const emit = defineEmits(['suelo-ready', 'select-feature'])
const { map } = toRefs(props)

onMounted(() => {
  if (!map.value) return

  // Capas base
  const osm = L.tileLayer(OSM_TILE_URL, { attribution: OSM_ATTRIBUTION })
  const esriSat = L.tileLayer(ESRI_SAT_URL, {
    attribution: 'Tiles &copy; Esri …'
  })

  // Botón “home”
  if (!map.value._homeControlAdded) {
    const HomeControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd(mapInstance) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
        Object.assign(container.style, {
          background: '#fff',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        })
        container.title = 'Zoom a extensión general'
        container.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>`
        container.onmousedown = container.ondblclick = L.DomEvent.stopPropagation
        container.onclick = () => {
          mapInstance.setView([10.3369959599, -68.272687215], 12)
        }
        return container
      }
    })
    map.value.addControl(new HomeControl())
    map.value._homeControlAdded = true
  }

  // Overlays WMS
  const wmsOptions = {
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'GeoServer Gira360'
  }
  const wmsPerimetro = L.tileLayer.wms(GEOSERVER_WMS_URL, { ...wmsOptions, layers: 'canoabo:pg_perimetro' })
  const wmsRios = L.tileLayer.wms(GEOSERVER_WMS_URL, { ...wmsOptions, layers: 'canoabo:pg_rios_ur' })
  const wmsEmbalse = L.tileLayer.wms(GEOSERVER_WMS_URL, { ...wmsOptions, layers: 'canoabo:pg_embalse_ur' })

  const baseLayers = { 'OpenStreetMap': osm, 'Esri Satelital': esriSat }
  const overlays = {
    'Perímetro Canoabo': wmsPerimetro,
    'Ríos': wmsRios,
    'Embalse': wmsEmbalse
  }
  const layersControl = L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map.value)

  // GeoJSON suelo (WFS)
  let selectedSueloLayer = null
  fetch(GEOSERVER_WFS_SUELO_URL)
    .then(res => {
      if (!res.ok) {
        console.error('Error al obtener GeoJSON de suelo:', res.status, res.statusText)
        return null
      }
      return res.json()
    })
    .then(geojson => {
      if (!geojson || !geojson.features?.length) {
        console.warn('GeoJSON de suelo no contiene features.')
        return
      }

      const texturaColors = {
        a: '#2d2139', aF: '#7fa7c5', F: '#3ecfc6', Fa: '#8eea70',
        FA: '#c2e96a', FAa: '#e3a23c', FL: '#a34b0e', Si: '#2d1e1b'
      }

      const sueloLayer = L.geoJSON(geojson, {
        pointToLayer(feature, latlng) {
          const nombre = feature.properties.h1_text || 'Si'
          const color = texturaColors[nombre] || '#888'
          return L.circleMarker(latlng, {
            radius: 5, fillColor: color, color: '#222',
            weight: 1, opacity: 1, fillOpacity: 0.9
          })
        },
        onEachFeature(feature, layer) {
          layer.on('click', () => {
            const nombre = feature.properties.h1_text || ''
            const color = texturaColors[nombre] || '#888'
            const popupContent = `
              <div style="min-width:180px; font-family:sans-serif;">
                <div style="font-size:1.1em;font-weight:bold;color:#3eaf7c;margin-bottom:4px;">
                  ${feature.properties.nombre || 'Sin nombre'}
                </div>
                <div><b>Textura:</b> <span style="color:${color};font-weight:bold;">
                  ${nombre || '-'}
                </span></div>
                <div><b>Capacidad Uso:</b> ${feature.properties.cuso || '-'}</div>
              </div>`
            layer.bindPopup(popupContent).openPopup()
            

emit('select-feature', feature.properties.id)
            // Resaltar el punto seleccionado
            if (selectedSueloLayer) {
              selectedSueloLayer.eachLayer(l => {
                l.setStyle({ radius: 5, color: '#222', weight: 1 })
                if (String(l.feature?.properties?.id) === String(feature.properties.id)) {
                  l.setStyle({ radius: 10, color: '#000', weight: 3 })
                }
              })
            }
          })
        }
      }).addTo(map.value)

      sueloLayer.bringToFront()
      layersControl.addOverlay(sueloLayer, 'Suelo')
      selectedSueloLayer = sueloLayer

      // Aplicar filtro inicial
      if (props.filterTextura) {
        selectedSueloLayer.eachLayer(layer => {
          const f = layer.feature
          if (f?.properties?.h1_text === props.filterTextura) {
            layer.setStyle({ radius: 7, color: '#ff2222', weight: 3 })
          }
        })
      }

      // Ajustar vista a capa
      if (sueloLayer.getBounds()?.isValid()) {
        map.value.fitBounds(sueloLayer.getBounds())
      }

      
      emit('suelo-ready', sueloLayer)
    })
    .catch(err => console.error('Error en fetch de capa suelo GeoJSON:', err))

  // Añadir capas por defecto
  esriSat.addTo(map.value)
  wmsPerimetro.addTo(map.value)

  // Control de zoom labels
  const addSueloLabels = () => {
    /* implementación de agregar etiquetas */
  }
  const removeSueloLabels = () => {
    /* implementación de remover etiquetas */
  }

  map.value.on('zoomend', () => {
    const zoom = map.value.getZoom()
    const center = map.value.getCenter()
    const p1 = map.value.latLngToContainerPoint(center)
    const lngOffset = map.value.containerPointToLatLng({ x: p1.x + 1, y: p1.y })
    const metersPerPixel = center.distanceTo(lngOffset)
    
    if (zoom > 14) addSueloLabels()
    else removeSueloLabels()
  })

  if (map.value.getZoom() > 14) addSueloLabels()

  // Resaltados por selección y filtro
  watch(() => props.selectedFeatureId, newId => {
    if (!selectedSueloLayer) return;
    selectedSueloLayer.eachLayer(layer => {
      // Siempre quitar resaltado
      layer.setStyle({ radius: 5, color: '#222', weight: 1 });
      // Si hay selección, resalta y abre popup
      if (newId && String(layer.feature?.properties?.id) === String(newId)) {
        layer.setStyle({ radius: 10, color: '#000', weight: 3 });
        layer.openPopup();
      } else {
        // Si no hay selección, cierra popup
        layer.closePopup && layer.closePopup();
      }
    });
  });

  watch(() => props.filterTextura, textura => {
    if (!selectedSueloLayer) return
    selectedSueloLayer.eachLayer(layer => {
      const f = layer.feature
      if (textura) {
        if (f?.properties?.h1_text === textura) {
          layer.setStyle({ radius: 7, color: '#ff2222', weight: 3 })
        } else {
          layer.setStyle({ radius: 5, color: '#222', weight: 1 })
        }
      } else {
        layer.setStyle({ radius: 5, color: '#222', weight: 1 })
      }
    })
  })
})
</script>

<style>
.suelo-label {
  pointer-events: none;
  text-align: center;
}
.suelo-label-text {
  display: inline-block;
  background: none;
  color: #000;
  font-size: 10px;
  font-family: sans-serif;
  font-weight: 600;
  margin-top: 2px;
  white-space: nowrap;
  text-shadow: 0 0 5px #fff;
}
</style>
