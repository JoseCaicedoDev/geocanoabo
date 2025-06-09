<script setup>
import { onMounted, watch, toRefs } from 'vue'
import L from 'leaflet'
import { OSM_TILE_URL, OSM_ATTRIBUTION, ESRI_SAT_URL, GEOSERVER_WMS_URL, GEOSERVER_WFS_SUELO_URL } from '../../urls.js'

const props = defineProps({
  map: { type: Object, required: true },
  selectedFeatureId: { type: [String, Number], default: null }
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
  });

  // Definir baseLayers y overlays SIN suelo
  const baseLayers = {
    "OpenStreetMap": osm,
    "Esri Satelital": esriSat
  };
  const overlays = {
    "Perímetro Canoabo": wmsPerimetro,
    "Ríos": wmsRios,
    "Embalse": wmsEmbalse
  };
  const layersControl = L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map.value);

  // Capa de suelo como GeoJSON (WFS)
  let selectedSueloLayer = null;
  fetch(GEOSERVER_WFS_SUELO_URL)
    .then(res => {
      if (!res.ok) {
        console.error('Error al obtener GeoJSON de suelo:', res.status, res.statusText);
        return null;
      }
      return res.json();
    })
    .then(geojson => {
      if (!geojson) return;
      console.log('GeoJSON suelo recibido:', geojson);
      if (!geojson.features || geojson.features.length === 0) {
        console.warn('GeoJSON de suelo no contiene features.');
        return;
      }
      // Mapeo de colores por tipo de textura
      const texturaColors = {
        "a": "#2d2139",
        "aF": "#7fa7c5",
        "F": "#3ecfc6",
        "Fa": "#8eea70",
        "FA": "#c2e96a",
        "FAa": "#e3a23c",
        "FL": "#a34b0e",
        "Si": "#2d1e1b"
      };
      const sueloLayer = L.geoJSON(geojson, {
        pointToLayer: function(feature, latlng) {
          // Usar el nombre de la textura para elegir color
          const nombre = feature.properties.h1_text || "Si";
          const color = texturaColors[nombre] || "#888";
          return L.circleMarker(latlng, {
            radius: 5,
            fillColor: color,
            color: "#222",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
          });
        },
        onEachFeature: function (feature, layer) {
          layer.on('click', function () {
            // Usa el mismo color que el punto
            const color = texturaColors[feature.properties.h1_text] || "#888";
            const popupContent = `
              <div style="min-width:180px; font-family:sans-serif;">
                <div style="font-size:1.1em; font-weight:bold; color:#3eaf7c; margin-bottom:4px;">
                  ${feature.properties.nombre || 'Sin nombre'}
                </div>
                <div><b>Textura:</b> <span style="color:${color}; font-weight:bold;">${feature.properties.h1_text || '-'}</span></div>
                <div><b>Capacidad Uso:</b> ${feature.properties.cuso || '-'}</div>
              </div>
            `;
            layer.bindPopup(popupContent).openPopup();
          });
        }
      }).addTo(map.value);
      sueloLayer.bringToFront();
      layersControl.addOverlay(sueloLayer, "Suelo");
      selectedSueloLayer = sueloLayer;
      // Forzar zoom a la extensión de la capa de suelo
      if (sueloLayer.getBounds && sueloLayer.getBounds().isValid()) {
        map.value.fitBounds(sueloLayer.getBounds());
      }
      console.log('Capa de suelo añadida al mapa. Features:', geojson.features.length);
      emit('suelo-ready', sueloLayer);
    })
    .catch(err => {
      console.error('Error en fetch de capa suelo GeoJSON:', err);
    });

  // Solo la base por defecto se agrega al mapa
  esriSat.addTo(map.value)
  wmsPerimetro.addTo(map.value)

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

  // El control de escala ya está añadido arriba

  // --- Watch para resaltar punto seleccionado desde la tabla ---
  watch(() => props.selectedFeatureId, (newId) => {
    if (!newId || !selectedSueloLayer) return;
    selectedSueloLayer.eachLayer(layer => {
      // Reset estilo
      layer.setStyle({ radius: 5, color: "#222", weight: 1 });
      if (layer.feature && String(layer.feature.properties.id) === String(newId)) {
        layer.setStyle({ radius: 10, color: "#FFD600", weight: 3 });
        layer.openPopup();
        map.value.setView(layer.getLatLng(), 15, { animate: true });
      }
    });
  });
})
</script>
