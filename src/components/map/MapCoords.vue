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
      const [x, y] = proj4('EPSG:4326', 'EPSG:2202', [latlng.lng, latlng.lat]);
      // SVG de ubicación similar al de INVÍAS
      const iconSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24'><path d='M12 2C7.03 2 3 6.03 3 11c0 5.25 7.03 11 8.41 12.16a1.25 1.25 0 0 0 1.18 0C13.97 22 21 16.25 21 11c0-4.97-4.03-9-9-9Zm0 17.88C10.13 18.1 5 13.94 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.94-5.13 7.1-7 8.88Zm0-10.38A2.5 2.5 0 1 0 12 15a2.5 2.5 0 0 0 0-5Zm0 4A1.5 1.5 0 1 1 12 9a1.5 1.5 0 0 1 0 3Z' fill='#555'/></svg>`;
      const xStr = x.toFixed(2);
      const yStr = y.toFixed(2);
      const latStr = latlng.lat.toFixed(6);
      const lonStr = latlng.lng.toFixed(6);
      this._div.innerHTML = `
        <div style="display:flex;align-items:center;gap:5px;background:#fff;padding:7px 6px 7px 6px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.13);font-size:16px;user-select:text;min-width:250px;">
          <span style='display:flex;align-items:center;margin-right:8px;'>${iconSvg}</span>
          <span id='coords-text' style='font-family:monospace;font-size:13px;letter-spacing:0.5px;'>X: <span id="x-coord">${xStr}</span>  Y: <span id="y-coord">${yStr}</span></span>
          <button id="copy-coords-btn" title="Copiar X, Y" style="margin-left:auto;border:none;background:transparent;cursor:pointer;font-size:18px;padding:2px;display:flex;align-items:center;">
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24'><rect x='9' y='9' width='13' height='13' rx='2' fill='#f5f5f5' stroke='#888' stroke-width='1.5'/><rect x='3' y='3' width='13' height='13' rx='2' fill='#fff' stroke='#888' stroke-width='1.5'/></svg>
          </button>
        </div>
      `;
      setTimeout(() => {
        const btn = this._div.querySelector('#copy-coords-btn');
        if (btn) {
          btn.onclick = (ev) => {
            ev.stopPropagation();
            // Copiar X, Y en EPSG:2202, 2 decimales, formato "x, y"
            const text = `${xStr}, ${yStr}`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(text);
            } else {
              // Fallback para navegadores antiguos
              const textarea = document.createElement('textarea');
              textarea.value = text;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
            }
            btn.title = '¡Copiado!';
            btn.style.background = '#e0ffe0';
            setTimeout(() => {
              btn.title = 'Copiar X, Y';
              btn.style.background = 'transparent';
            }, 900);
          }
        }
      }, 0);
    } else {
      this._div.innerHTML = 'Mueve el cursor sobre el mapa';
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
