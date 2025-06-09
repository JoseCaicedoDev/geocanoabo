<script setup>
import { onMounted, onBeforeUnmount, toRefs, watch } from 'vue'
import L from 'leaflet'

const props = defineProps({
  map: { type: Object, required: true }
})
const { map } = toRefs(props)

let scaleControl = null
let scaleControlInstance = null

function addScaleControl() {
  if (!map.value) return
  if (scaleControlInstance) {
    map.value.removeControl(scaleControlInstance)
    scaleControlInstance = null
  }
  scaleControl = L.Control.extend({
    options: { position: 'bottomright' },
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-control leaflet-scale-custom');
      container.style.background = '#fff';
      container.style.padding = '3px 12px';
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.10)';
      container.style.fontSize = '13px';
      container.style.color = '#222';
      function updateScale() {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const lat = center.lat * Math.PI / 180;
        const metersPerPixel = 40075016.686 * Math.abs(Math.cos(lat)) / Math.pow(2, zoom + 8);
        const scale = Math.round(metersPerPixel / 0.0002646);
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
  scaleControlInstance = new scaleControl();
  map.value.addControl(scaleControlInstance);
}

onMounted(() => {
  addScaleControl();
});

watch(map, (newMap, oldMap) => {
  if (oldMap && scaleControlInstance) {
    oldMap.removeControl(scaleControlInstance);
    scaleControlInstance = null;
  }
  if (newMap) {
    addScaleControl();
  }
});

onBeforeUnmount(() => {
  if (map.value && scaleControlInstance) {
    map.value.removeControl(scaleControlInstance);
    scaleControlInstance = null;
  }
})
</script>
