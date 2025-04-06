import { ref } from 'vue';
import { fetchCharacters, searchCharacters as searchCharactersUtil, type CharacterProperties } from '@/utils/fetchData';

export function useCharacters() {
  const characters = ref<CharacterProperties[]>([]);
  const allCharacters = ref<CharacterProperties[]>([]);
  const loading = ref(true);
  const isFetchingMore = ref(false);

  async function loadCharacters() {
    loading.value = true;
    try {
      const newCharacters = await fetchCharacters();
      allCharacters.value = newCharacters;
      characters.value = allCharacters.value.slice(0, 10);
    } finally {
      loading.value = false;
    }
  }

  async function searchCharacters(query: string) {
    if (query.trim() === '') {
      allCharacters.value = [];
      characters.value = [];
      loadCharacters();
      return;
    }

    loading.value = true;
    try {
      const filteredCharacters = await searchCharactersUtil(query.trim());
      allCharacters.value = filteredCharacters;
      characters.value = allCharacters.value.slice(0, 10);
    } finally {
      loading.value = false;
    }
  }

  async function fetchMore() {
    isFetchingMore.value = true;
    try {
      const newCharacters = await fetchCharacters();
      allCharacters.value = [...allCharacters.value, ...newCharacters];
      const currentLength = characters.value.length;
      characters.value = allCharacters.value.slice(0, currentLength + 10);
    } finally {
      isFetchingMore.value = false;
    }
  }

  return {
    characters,
    allCharacters,
    loading,
    isFetchingMore,
    loadCharacters,
    searchCharacters,
    fetchMore,
  };
}
