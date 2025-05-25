import { ref, provide, watch } from 'vue'

const messages = {
  ES: {
    title: 'GeoCanoabo: Territorio en Datos',
    menu: 'Menú',
    pin: 'Fijar',
    unpin: 'Desfijar',
    hide: 'Ocultar',
    show: 'Mostrar',
    legend: 'Perímetro Canoabo',
    coords: 'Pasa el cursor sobre el mapa',
    x: 'X',
    y: 'Y',
    epsg: '(EPSG:2202)'
  },
  EN: {
    title: 'GeoCanoabo: Territory in Data',
    menu: 'Menu',
    pin: 'Pin',
    unpin: 'Unpin',
    hide: 'Hide',
    show: 'Show',
    legend: 'Canoabo Perimeter',
    coords: 'Hover over the map',
    x: 'X',
    y: 'Y',
    epsg: '(EPSG:2202)'
  },
}

export function useI18n() {
  const selectedLang = ref(localStorage.getItem('lang') || 'ES')
  const t = (key) => messages[selectedLang.value][key] || key
  provide('t', t)
  provide('selectedLang', selectedLang)
  watch(selectedLang, (val) => { localStorage.setItem('lang', val) })
  return { t, selectedLang }
}
