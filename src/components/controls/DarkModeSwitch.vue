<template>
  <button @click="$emit('update:modelValue', !modelValue)" class="p-2 rounded-full hover:bg-[#02A9FB]/20 transition" :title="modelValue ? 'Modo claro' : 'Modo oscuro'" aria-label="Cambiar modo claro/oscuro">
    <svg v-if="!modelValue" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#015059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#3eaf7c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
    </svg>
  </button>
</template>
<script setup>
defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])
</script>
