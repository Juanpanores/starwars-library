<template>
  <div class="input-with-title">
    <p class="title">{{ title }}</p>
    <input
      :type="type"
      v-model="searchQuery"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', searchQuery)"
      class="input-field"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
const searchQuery = ref('')

defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-with-title {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1rem;
  font-weight: bold;
}

.input-field {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
