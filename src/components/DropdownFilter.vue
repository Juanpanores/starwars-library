<template>
  <div class="dropdown-filter">
    <p>{{ title }}</p>
    <select v-model="localValue" @change="handleChange" class="dropdown" :disabled="disabled">
      <option value="">Todos</option>
      <option v-for="item in items" :key="item" :value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  title: String,
  items: Array as () => string[],
  modelValue: String,
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);
const localValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

const handleChange = () => {
  emit('update:modelValue', localValue.value);
  emit('change', localValue.value);
};
</script>

<style scoped>

.dropdown {
  flex: 1;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  min-width: 250px;
}
</style>
