<template>
  <section class="h-screen grid grid-rows-[auto_1fr] grid-cols-1 bg-background dark:bg-background-dark">
    <AppHeader :title="t('title')" :darkMode="darkMode">
      <template #desktop-controls>
        <div class="hidden md:flex gap-2">
          <LangSwitch v-model="selectedLang" />
          <DarkModeSwitch v-model="darkMode" />
        </div>
      </template>
      <template #mobile-hamburger>
        <HamburgerButton :open="showMobileMenu" @toggle="showMobileMenu = !showMobileMenu" />
      </template>
    </AppHeader>
    <MobileMenu :open="showMobileMenu" @close="showMobileMenu = false">
      <div class="flex flex-col gap-6 md:hidden">
        <LangSwitch v-model="selectedLang" />
        <DarkModeSwitch v-model="darkMode" />
      </div>
    </MobileMenu>
    <MainLayout v-model:menuVisible="menuVisible" v-model:menuPinned="menuPinned">
      <MapView />
    </MainLayout>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import HamburgerButton from './components/layout/HamburgerButton.vue'
import MobileMenu from './components/layout/MobileMenu.vue'
import MainLayout from './components/layout/MainLayout.vue'
import LangSwitch from './components/controls/LangSwitch.vue'
import DarkModeSwitch from './components/controls/DarkModeSwitch.vue'
import MapView from './components/MapView.vue'
import { useI18n } from './composables/useI18n'
import { useDarkMode } from './composables/useDarkMode'

const { t, selectedLang } = useI18n()
const { darkMode } = useDarkMode()
const menuVisible = ref(true)
const menuPinned = ref(false)
const showMobileMenu = ref(false)
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden !important;
}
#app {
  height: 100%;
  width: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}
</style>
