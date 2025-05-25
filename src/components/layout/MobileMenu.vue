<template>
  <transition name="fade">
    <div v-if="open" class="fixed left-0 right-0 top-[56px] bottom-0 bg-black bg-opacity-70 z-[2000] md:hidden"></div>
  </transition>
  <transition name="slide">
    <aside v-if="open" class="fixed left-0 top-[56px] h-[calc(100vh-56px)] w-full bg-white dark:bg-[#222] z-[2100] p-6 flex flex-col items-center justify-center md:hidden shadow-lg">

      <slot />
    </aside>
  </transition>
</template>
<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])
</script>
