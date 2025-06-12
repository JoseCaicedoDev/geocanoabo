<template>
  <section class="doughnut-section" aria-label="Gráfico de texturas de suelo">
    <h2 class="doughnut-title">Tipos de textura de suelo</h2>
    <canvas ref="chartRef" aria-label="Doughnut chart de texturas de suelo" role="img"></canvas>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  soilFeatures: { type: Array, required: true }
})
const chartRef = ref(null)
let chartInstance = null
let selectedTextura = null // Para toggle

const emit = defineEmits(['filter-textura'])

const texturaColors = {
  "a": "#2d2139",
  "aF": "#7fa7c5",
  "F": "#3ecfc6",
  "Fa": "#8eea70",
  "FA": "#c2e96a",
  "FAa": "#e3a23c",
  "FL": "#a34b0e",
  "Si": "#2d1e1b"
}

function getTexturaData(features) {
  const counts = {}
  features.forEach(f => {
    const t = f.properties?.h1_text || 'Sin dato'
    counts[t] = (counts[t] || 0) + 1
  })
  return counts
}

function renderChart() {
  if (!chartRef.value) return
  const data = getTexturaData(props.soilFeatures)
  const labels = Object.keys(data)
  const values = Object.values(data)
  const colors = labels.map(l => texturaColors[l] || '#888')
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right', labels: { color: '#222', font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = values.reduce((a, b) => a + b, 0)
              const val = ctx.parsed
              const pct = ((val / total) * 100).toFixed(1)
              return `${ctx.label}: ${val} (${pct}%)`
            }
          }
        },
        title: { display: false }
      },
      animation: { animateRotate: true, animateScale: true },
      onClick: (evt, elements) => {
        if (!elements.length) {
          emit('filter-textura', null)
          selectedTextura = null
          return
        }
        const idx = elements[0].index
        const label = labels[idx]
        // Toggle: si ya está seleccionada, deselecciona
        if (selectedTextura === label) {
          emit('filter-textura', null)
          selectedTextura = null
        } else {
          emit('filter-textura', label)
          selectedTextura = label
        }
      }
    }
  })
}

onMounted(renderChart)
watch(() => props.soilFeatures, renderChart, { deep: true })
</script>

<style scoped>
.doughnut-section {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.doughnut-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #222;
}
canvas {
  max-width: 100%;
  max-height: 320px;
}
</style>
