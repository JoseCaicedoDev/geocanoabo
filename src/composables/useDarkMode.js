import { ref, provide, watch, onMounted } from 'vue'

export function useDarkMode() {
  const darkMode = ref(localStorage.getItem('theme') === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme')))
  const setHtmlDark = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark)
  }
  onMounted(() => setHtmlDark(darkMode.value))
  watch(darkMode, (val) => {
    setHtmlDark(val)
    localStorage.setItem('theme', val ? 'dark' : 'light')
  })
  provide('darkMode', darkMode)
  return { darkMode }
}
