<template>
  <div class="table-container">
    <h1 class="title">Star Wars Wiki</h1>
    <input
      type="text"
      v-model="searchQuery"
      @input="onSearchInput"
      placeholder="Buscar personaje..."
      class="search-input"
    />
    <CharacterTableContent
      :characters="characters"
      :loading="loading"
      :isFetchingMore="isFetchingMore"
    />
    <div class="fetch-more">
      <button @click="fetchMore" :disabled="loading || isFetchingMore">
        {{ loading || isFetchingMore ? 'Cargando...' : 'Cargar más' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCharacters } from '@/composables/useCharacters';
import CharacterTableContent from './CharacterTableContent.vue';

const {
  characters,
  loading,
  isFetchingMore,
  loadCharacters,
  searchCharacters,
  fetchMore,
} = useCharacters();

const searchQuery = ref('');
let searchTimeout: number | undefined;

function onSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = window.setTimeout(() => {
    searchCharacters(value);
  }, 300);
}

loadCharacters();
</script>

<style scoped>
.table-container {  
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  width: 100%;
  padding: 1rem 10%;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 2rem;
}

.title {
  font-size: 2.5rem;
  color: yellow;
  font-family: 'Star Jedi', sans-serif;
  text-shadow: 2px 2px 4px gray;
  margin-bottom: 1rem;
  text-align: center;
}

.search-input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
table {
  border-radius: 1rem;
  overflow: hidden; 
}

.fetch-more {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.fetch-more button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.fetch-more button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}


</style>
