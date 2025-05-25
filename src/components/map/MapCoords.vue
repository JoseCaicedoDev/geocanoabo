<script setup>
import { onMounted, onBeforeUnmount, toRefs } from 'vue'
import L from 'leaflet'
import proj4 from 'proj4'

const props = defineProps({
  map: { type: Object, required: true }
})
const { map } = toRefs(props)

let coordControl = null

onMounted(() => {
  if (!map.value) return

  // Definir proyección EPSG:2202
  proj4.defs('EPSG:2202', "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-75.0 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")

  coordControl = L.control({ position: 'bottomright' })
  coordControl.onAdd = function () {
    this._div = L.DomUtil.create('div', 'leaflet-coords-control')
    this._div.style.background = '#fff'
    this._div.style.padding = '4px 10px'
    this._div.style.borderRadius = '6px'
    this._div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)'
    this._div.style.fontSize = '13px'
    this.update()
    return this._div
  }
  coordControl.update = function (latlng) {
    if (latlng) {
      const [x, y] = proj4('EPSG:4326', 'EPSG:2202', [latlng.lng, latlng.lat])
      this._div.innerHTML = `<b>X:</b> ${x.toFixed(2)}<br><b>Y:</b> ${y.toFixed(2)}<br><span style='font-size:11px;color:#888'>EPSG:2202</span>`
    } else {
      this._div.innerHTML = 'Mueve el cursor sobre el mapa'
    }
  }
  coordControl.addTo(map.value)

  map.value.on('mousemove', function (e) {
    coordControl.update(e.latlng)
  })
  map.value.on('mouseout', function () {
    coordControl.update()
  })
})

onBeforeUnmount(() => {
  if (coordControl && map.value) {
    coordControl.remove()
  }
})
</script>
