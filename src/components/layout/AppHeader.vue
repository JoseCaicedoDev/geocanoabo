<template>
  <header class="row-start-1 row-end-2 col-span-1 flex items-center justify-between px-4 py-2 bg-primary dark:bg-[#1a1a1a] border-b border-border dark:border-[#222]">
    <div class="flex items-center space-x-3">
      <img v-if="!darkMode" src="/logo.png" alt="Logo GeoCanoabo" class="h-10 w-10" />
      <img v-else src="/logo-dark.png" alt="Logo GeoCanoabo dark" class="h-10 w-10" />
      <span class="font-montserrat text-2xl font-bold text-[#015059] dark:text-[#3eaf7c]">
        <span class="block md:hidden">GeoCanoabo</span>
        <span class="hidden md:block">{{ title }}</span>
      </span>
    </div>
    <nav aria-label="Opciones de usuario" class="flex items-center">
      <slot name="desktop-controls" />
      <div class="md:hidden flex items-center">
        <slot name="mobile-hamburger" />
      </div>
    </nav>
  </header>
</template>
<script setup>
defineProps({
  title: String,
  darkMode: Boolean
})
</script>
