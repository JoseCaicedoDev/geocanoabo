<script setup>
import { onMounted, onBeforeUnmount, toRefs } from 'vue'
import L from 'leaflet'

const props = defineProps({
  map: { type: Object, required: true }
})
const { map } = toRefs(props)

onMounted(() => {
  
})

onBeforeUnmount(() => {
  
})
</script>
