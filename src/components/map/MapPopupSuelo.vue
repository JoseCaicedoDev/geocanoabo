<script setup>
import { onMounted, toRefs } from 'vue'
import L from 'leaflet'

const props = defineProps({
  map: { type: Object, required: true },
  sueloLayer: { type: Object, required: true }
})
const { map, sueloLayer } = toRefs(props)

function getFeatureInfoUrl(map, layer, latlng, params = {}) {
  const point = map.latLngToContainerPoint(latlng, map.getZoom());
  const size = map.getSize();
  const baseParams = {
    request: 'GetFeatureInfo',
    service: 'WMS',
    srs: 'EPSG:4326',
    styles: '',
    transparent: true,
    version: '1.1.0',
    format: 'image/png',
    bbox: map.getBounds().toBBoxString(),
    height: size.y,
    width: size.x,
    layers: 'canoabo:pg_Suelo8_ur',
    query_layers: 'canoabo:pg_Suelo8_ur',
    info_format: 'application/json',
    x: Math.floor(point.x),
    y: Math.floor(point.y)
  }
  const allParams = { ...baseParams, ...params }
  return layer._url + L.Util.getParamString(allParams, layer._url, true)
}

onMounted(() => {
  if (!map.value || !sueloLayer.value) return
  map.value.on('click', function(e) {
    if (map.value.hasLayer(sueloLayer.value)) {
      // 1. Intenta JSON primero
      const urlJson = getFeatureInfoUrl(
        map.value,
        sueloLayer.value,
        e.latlng,
        {
          info_format: 'application/json',
          propertyName: ''
        }
      )
      fetch(urlJson)
        .then(response => {
          if (!response.ok) throw new Error('No JSON')
          return response.json()
        })
        .then(data => {
          if (data.features && data.features.length > 0) {
            const props = data.features[0].properties
            let html = '<b>Atributos de Suelo:</b><ul>'
            for (const key in props) {
              html += `<li><b>${key}:</b> ${props[key]}</li>`
            }
            html += '</ul>'
            L.popup()
              .setLatLng(e.latlng)
              .setContent(html)
              .openOn(map.value)
          } else {
            L.popup()
              .setLatLng(e.latlng)
              .setContent('No hay datos en este punto.')
              .openOn(map.value)
          }
        })
        .catch(() => {
          // 2. Si falla, intenta HTML
          const urlHtml = getFeatureInfoUrl(
            map.value,
            sueloLayer.value,
            e.latlng,
            {
              info_format: 'text/html',
              propertyName: ''
            }
          )
          fetch(urlHtml)
            .then(response => {
              if (!response.ok) throw new Error('No HTML')
              return response.text()
            })
            .then(html => {
              L.popup()
                .setLatLng(e.latlng)
                .setContent(html)
                .openOn(map.value)
            })
            .catch(() => {
              L.popup()
                .setLatLng(e.latlng)
                .setContent('Error consultando atributos.')
                .openOn(map.value)
            })
        })
    }
  })
})
</script>
