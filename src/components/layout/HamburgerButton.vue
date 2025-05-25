<template>
  <button @click="$emit('toggle')" class="p-2 rounded-full hover:bg-[#02A9FB]/20 transition" aria-label="Abrir menú de usuario">
    <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#015059] dark:text-[#3eaf7c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#015059] dark:text-[#3eaf7c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</template>
<script setup>
defineProps({ open: Boolean })
defineEmits(['toggle'])
</script>
