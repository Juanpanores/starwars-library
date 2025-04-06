<template>
  <div class="table-container">
    <h1 class="title">Personajes Favoritos</h1>
    <div v-if="favoriteCharacters.length === 0" class="no-results">
      <p>No tienes personajes favoritos.</p>
    </div>
    <CharacterTableContent
      v-else
      :characters="favoriteCharacters"
      :skeletonLoading="false"
      :loading="false"
      :favorites="favoriteCharacters"
      @toggleFavorite="toggleFavorite"
    />
    <div class="back-button">
      <button @click="goBack">Volver</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterTableContent from '../components/CharacterTableContent.vue';
import { useFavorite } from '../composables/useFavorite';
import { useRouter } from 'vue-router';

const { favoriteCharacters, toggleFavorite } = useFavorite();
const router = useRouter();

const goBack = () => {
  router.back();
};
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

  .back-button {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .back-button button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  .back-button button:hover {
    background-color: #0056b3;
  }
</style>
