<template>
  <input
    type="text"
    v-model="query"
    @input="onInput"
    placeholder="Buscar personaje..."
    class="search-input"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{ query: string }>();
const emit = defineEmits<['update:query']>();

function onInput(event: Event) {
  emit('update:query', (event.target as HTMLInputElement).value);
}
</script>

<style scoped>
.search-input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
