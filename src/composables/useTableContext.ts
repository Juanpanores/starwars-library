import { ref, onMounted } from 'vue'
import { starwarsService, type CharacterProperties } from '@/services/starwarsService'

export function useCharacters() {
  const characters = ref<CharacterProperties[]>([])
  const page = ref<number>(1)
  const skeletonLoading = ref(true)
  const loading = ref(false)
  const vehicles = ref<string[]>([])
  const species = ref<string[]>([])
  const selectedVehicle = ref(localStorage.getItem('selectedVehicle') || '')
  const selectedSpecies = ref(localStorage.getItem('selectedSpecies') || '')
  let searchTimeout: number | undefined

  async function loadCharacters() {
    skeletonLoading.value = true
    try {
      const newCharacters = await starwarsService.fetchCharacters(page.value)
      characters.value = newCharacters.slice(0, 10)
    } catch (error) {
      console.error('Error loading characters:', error)
    }
    skeletonLoading.value = false
  }

  async function searchCharacters(query: string) {
    if (query.trim() === '') {
      page.value = 1
      characters.value = []
      loadCharacters()
      return
    }

    loading.value = true
    try {
      const filteredCharacters = await starwarsService.searchCharacters(query.trim())
      characters.value = filteredCharacters.slice(0, 10)
    } catch (error) {
      console.error('Error searching characters:', error)
    } finally {
      loading.value = false
    }
  }

  function onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    if (searchTimeout) clearTimeout(searchTimeout)

    searchTimeout = window.setTimeout(() => {
      loading.value = true
      searchCharacters(value)
      loading.value = false
    }, 300)
  }

  async function onVehicleChange() {
    loading.value = true
    selectedSpecies.value = ''
    localStorage.setItem('selectedVehicle', selectedVehicle.value)
    localStorage.removeItem('selectedSpecies')
    try {
      if (selectedVehicle.value) {
        characters.value = await starwarsService.fetchPeopleByVehicle(selectedVehicle.value)
      } else {
        loadCharacters()
      }
    } catch (error) {
      console.error('Error changing vehicle:', error)
    } finally {
      loading.value = false
    }
  }

  async function onSpeciesChange() {
    loading.value = true
    selectedVehicle.value = ''
    localStorage.setItem('selectedSpecies', selectedSpecies.value)
    localStorage.removeItem('selectedVehicle')
    try {
      if (selectedSpecies.value) {
        characters.value = await starwarsService.fetchPeopleBySpecies(selectedSpecies.value)
      } else {
        loadCharacters()
      }
    } catch (error) {
      console.error('Error changing species:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchMore() {
    loading.value = true
    page.value += 1
    try {
      const newCharacters = await starwarsService.fetchCharacters(page.value)
      characters.value = [...characters.value, ...newCharacters.slice(0, 10)]
    } catch (error) {
      console.error('Error fetching more characters:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    skeletonLoading.value = true
    try {
      vehicles.value = await starwarsService.fetchVehicles()
      species.value = await starwarsService.fetchSpecies()

      if (selectedVehicle.value) {
        characters.value = await starwarsService.fetchPeopleByVehicle(selectedVehicle.value)
        skeletonLoading.value = false
      } else if (selectedSpecies.value) {
        characters.value = await starwarsService.fetchPeopleBySpecies(selectedSpecies.value)
        skeletonLoading.value = false
      } else {
        loadCharacters()
      }
    } catch (error) {
      console.error('Error during onMounted:', error)
    }
  })

  return {
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
    searchCharacters,
    fetchMore,
  }
}
