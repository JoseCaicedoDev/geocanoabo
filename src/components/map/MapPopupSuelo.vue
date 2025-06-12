<script setup>
import { onMounted, toRefs } from 'vue'

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
  if (!map.value || !sueloLayer.value) return;
  // Recorre cada layer del sueloLayer y le asocia un popup
  sueloLayer.value.eachLayer(layer => {
    if (layer.feature && layer.feature.properties) {
      const props = layer.feature.properties;
      let popupContent = '<table>' +
        `<tr><th>Nombre:</th><td>${props.nombre ?? ''}</td></tr>` +
        `<tr><th>Textura:</th><td>${props.h1_text ?? ''}</td></tr>` +
        `<tr><th>Capacidad Uso:</th><td>${props.cuso ?? ''}</td></tr>` +
        '</table>';
      layer.bindPopup(popupContent, { maxHeight: 300 });
    }
  });
});
</script>
