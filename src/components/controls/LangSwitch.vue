<template>
  <div class="flex items-center space-x-2">
    <span :class="['text-xs font-bold', modelValue === 'ES' ? 'text-[#015059] dark:text-[#3eaf7c]' : 'text-gray-400']">ES</span>
    <button @click="$emit('update:modelValue', modelValue === 'ES' ? 'EN' : 'ES')"
            class="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#02A9FB] flex items-center"
            aria-label="Cambiar idioma">
      <span class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
            :style="modelValue === 'EN' ? 'transform: translateX(24px);' : ''"></span>
      <span v-if="modelValue === 'EN'" class="absolute left-7 top-1 w-4 h-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#015059] dark:text-[#3eaf7c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
      </span>
      <span v-else class="absolute left-1 top-1 w-4 h-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#015059] dark:text-[#3eaf7c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
      </span>
    </button>
    <span :class="['text-xs font-bold', modelValue === 'EN' ? 'text-[#015059] dark:text-[#3eaf7c]' : 'text-gray-400']">EN</span>
  </div>
</template>
<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>
