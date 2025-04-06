<template>
  <table :class="{ 'loading-table': isFetchingMore }">
    <thead>
      <tr>
        <th class="header">Nombre</th>
        <th class="header">Género</th>
        <th class="header">Vehiculo</th>
        <th class="header">Especie</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="loading && characters.length === 0">
        <tr v-for="n in 10" :key="n">
          <td class="skeleton"></td>
          <td class="skeleton"></td>
          <td class="skeleton"></td>
          <td class="skeleton"></td>
        </tr>
      </template>
      <template v-else>
        <tr v-for="character in characters" :key="character.name">
          <td class="table_value">{{ character.name }}</td>
          <td class="table_value">{{ character.gender === "n/a" ? '-' : character.gender }}</td>
          <td class="table_value">{{ character.vehicles.length > 0 ? character.vehicles.join(', ') : '-' }}</td>
          <td class="table_value">{{ character.species.length > 0 ? character.species.join(', ') : '-' }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { CharacterProperties } from '@/utils/fetchData';

defineProps<{
  characters: CharacterProperties[];
  loading: boolean;
  isFetchingMore: boolean;
}>();
</script>

<style scoped>
.table_value {
  color: black;
}

.header {
  font-weight: bold;
  color: #333;
}

table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

table.loading-table {
  animation: pulse 1.5s infinite;
}

th, td {
  padding: 0.25rem;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.skeleton {
  background-color: #e0e0e0;
  height: 30px;
  width: 100px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}
</style>
