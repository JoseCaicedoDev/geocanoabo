<script setup>
import { onMounted, onBeforeUnmount, toRefs } from 'vue'
import L from 'leaflet'

const props = defineProps({
  map: { type: Object, required: true }
})
const { map } = toRefs(props)

let scaleControl = null

onMounted(() => {
  if (!map.value) return
  scaleControl = L.control.scale({
    position: 'bottomleft',
    metric: true,
    imperial: false
  })
  scaleControl.addTo(map.value)
})

onBeforeUnmount(() => {
  if (scaleControl && map.value) {
    scaleControl.remove()
  }
})
</script>
