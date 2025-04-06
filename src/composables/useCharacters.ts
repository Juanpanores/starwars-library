import { ref, onMounted } from 'vue';
import { fetchCharacters, searchCharacters as searchCharactersUtil, fetchVehicles, fetchSpecies, fetchPeopleByVehicle, fetchPeopleBySpecies, type CharacterProperties } from '@/utils/fetchData';

export function useCharacters() {
  const characters = ref<CharacterProperties[]>([]);
  const page = ref<number>(1);
  const skeletonLoading = ref(true);
  const loading = ref(false);
  const vehicles = ref<string[]>([]);
  const species = ref<string[]>([]);
  const selectedVehicle = ref(localStorage.getItem('selectedVehicle') || '');
  const selectedSpecies = ref(localStorage.getItem('selectedSpecies') || '');
  const searchQuery = ref('');
  let searchTimeout: number | undefined;

  async function loadCharacters() {
    skeletonLoading.value = true;
    try {
      const newCharacters = await fetchCharacters(page.value);
      characters.value = newCharacters.slice(0, 10);
    } finally {
      skeletonLoading.value = false;
    }
  }

  async function searchCharacters(query: string) {
    if (query.trim() === '') {
      page.value = 1;
      characters.value = [];
      loadCharacters();
      return;
    }

    skeletonLoading.value = true;
    try {
      const filteredCharacters = await searchCharactersUtil(query.trim());
      characters.value = filteredCharacters.slice(0, 10);
    } finally {
      skeletonLoading.value = false;
    }
  }

  function onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = window.setTimeout(() => {
      loading.value = true;
      searchCharacters(value);
      loading.value = false;
    }, 300);
  }

  async function onVehicleChange() {
    loading.value = true;
    selectedSpecies.value = '';
    localStorage.setItem('selectedVehicle', selectedVehicle.value);
    localStorage.removeItem('selectedSpecies');
    if (selectedVehicle.value) {
      characters.value = await fetchPeopleByVehicle(selectedVehicle.value);
    } else {
      loadCharacters();
    }
    loading.value = false;
  }

  async function onSpeciesChange() {
    loading.value = true;
    selectedVehicle.value = '';
    localStorage.setItem('selectedSpecies', selectedSpecies.value);
    localStorage.removeItem('selectedVehicle');
    if (selectedSpecies.value) {
      characters.value = await fetchPeopleBySpecies(selectedSpecies.value);
    } else {
      loadCharacters();
    }
    loading.value = false;
  }

  async function fetchMore() {
    loading.value = true;
    page.value += 1;
    try {
      const newCharacters = await fetchCharacters(page.value);
      characters.value = [...characters.value, ...newCharacters.slice(0, 10)];
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    loading.value = true;
    vehicles.value = await fetchVehicles();
    species.value = await fetchSpecies();

    if (selectedVehicle.value) {
      characters.value = await fetchPeopleByVehicle(selectedVehicle.value);
    } else if (selectedSpecies.value) {
      characters.value = await fetchPeopleBySpecies(selectedSpecies.value);
    } else {
      loadCharacters();
    }

    loading.value = false;
  });

  return {
    characters,
    skeletonLoading,
    loading,
    vehicles,
    species,
    selectedVehicle,
    selectedSpecies,
    searchQuery,
    onSearchInput,
    onVehicleChange,
    onSpeciesChange,
    loadCharacters,
    searchCharacters,
    fetchMore,
  };
}
