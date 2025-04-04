<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class ="header">Nombre</th>
          <th class ="header">Género</th>
          <th class ="header">Vehiculo</th>
          <th class ="header">Especie</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="n in 10" :key="n">
            <td class="skeleton"></td>
            <td class="skeleton"></td>
            <td class="skeleton"></td>
            <td class="skeleton"></td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="character in characters" :key="character.name">
            <td class = "table_value">{{ character.name }}</td>
            <td class = "table_value">{{ character.gender }}</td>
            <td class = "table_value">{{ character.vehicles.join(', ') || 'N/A' }}</td>
            <td class = "table_value">{{ character.species.join(', ') || 'N/A' }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCharactersWithDetails, type CharacterProperties } from '@/utils/fetchData';

const characters = ref<CharacterProperties[]>([]);
const loading = ref(true);

async function loadCharacters() {
  try {
    characters.value = await getCharactersWithDetails(); // Fetch the first 10 characters
  } finally {
    loading.value = false;
  }
}
loadCharacters();
</script>

<style scoped>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  width: 100%
}

.header{
  color: black
}

.table_value{
  color: black
}

table {
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 0.75rem;
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
  height: 1rem;
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

@media (max-width: 768px) {
  table {
    font-size: 0.9rem;
  }

  th, td {
    padding: 0.5rem;
  }
}
</style>
