import { ref, onMounted } from 'vue';

interface Character {
  name: string;
  gender: string;
  vehicles: string[];
  species: string[];
}

export function useFavorite() {
  const favoriteCharacters = ref<Character[]>([]);

  const loadFavorites = () => {
    const cachedFavorites = localStorage.getItem('favoriteCharacters') || '[]';
    try {
      favoriteCharacters.value = JSON.parse(cachedFavorites);
    } catch (error) {
      console.error('Error parsing favorite characters from localStorage:', error);
      favoriteCharacters.value = [];
    }
  };

  const toggleFavorite = (character: Character) => {
    const index = favoriteCharacters.value.findIndex((fav) => fav.name === character.name);
    if (index !== -1) {
      favoriteCharacters.value.splice(index, 1);
    } else {
      favoriteCharacters.value.push(character);
    }
    localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteCharacters.value));
  };

  onMounted(loadFavorites);

  return {
    favoriteCharacters,
    toggleFavorite,
  };
}
