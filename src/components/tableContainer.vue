<template>
  <div class="table-container">
    <div class="header-wrapper">
      <h1 class="title">{{ title }}</h1>
      <div class="favorites-button">
        <button @click="goToFavorites">Ver Favoritos</button>
      </div>
    </div>
    <div class="search-container">
      <div class="search-input-container">
        <SearchBar
          :placeholder="`Buscar ${title}`"
          :loading="loading"
          @input="onSearchInput"
          title="Personajes"
        />
      </div>
      <div class="dopdown-filter-container">
        <DropdownFilter
          title="Vehiculo"
          :items="vehicles"
          v-model="selectedVehicle"
          @change="onVehicleChange"
        />
        <DropdownFilter
          title="Especie"
          :items="species"
          v-model="selectedSpecies"
          @change="onSpeciesChange"
        />
      </div>
    </div>
    <div v-if="characters.length === 0 && !skeletonLoading" class="no-results">
      <p>Resultados, no hay.</p>
    </div>
    <CharacterTableContent
      v-else
      :characters="characters"
      :skeletonLoading="skeletonLoading"
      :loading="loading"
      :favorites="favoriteCharacters"
      @toggleFavorite="toggleFavorite"
    />
    <div class="fetch-more">
      <button @click="fetchMore" :disabled="skeletonLoading || loading">
        {{ skeletonLoading || loading ? 'Cargando...' : 'Ver más' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacters } from '@/composables/useTableContext'
import { useFavorite } from '@/composables/useHandleFavorite'
import CharacterTableContent from './tableContent.vue'
import DropdownFilter from './DropdownFilter.vue'
import SearchBar from './SearchBar.vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToFavorites = () => {
  router.push('/favorites')
}

const {
  characters,
  skeletonLoading,
  loading,
  vehicles,
  species,
  selectedVehicle,
  selectedSpecies,
  onSearchInput,
  onVehicleChange,
  onSpeciesChange,
  fetchMore,
} = useCharacters()

const { favoriteCharacters, toggleFavorite } = useFavorite()

defineProps({
  title: {
    type: String,
    required: true,
  },
})
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
  position: relative;
  z-index: 1;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.title {
  font-size: 2.5rem;
  color: yellow;
  font-family: 'Star Jedi', sans-serif;
  text-shadow: 2px 2px 4px gray;
  text-align: center;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: space-between;
}

.search-input-container {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.dopdown-filter-container {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: green;
  width: 100%;
  height: 200px;
  border-radius: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
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

.favorites-button button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.favorites-button button:hover {
  background-color: #218838;
}

@media (max-width: 1024px) {
  .header-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .favorites-button {
    align-self: flex-end;
    margin-top: 0.5rem;
  }

  .search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    justify-content: space-between;
  }

  .dropdown {
    flex: 1;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
  }
}

@media (max-width: 710px) {
  .dopdown-filter-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .dropdown-filter {
    width: 100%;
  }
}
</style>
