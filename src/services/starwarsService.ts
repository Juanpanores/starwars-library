export type CharacterProperties = {
  name: string
  gender: string
  vehicles: string[]
  species: string[]
}

export type VehicleProperties = {
  name: string
}

export type SpeciesProperties = {
  name: string
}

export type ApiResponse<T> = {
  result: {
    properties: T
  }
}

const API_BASE_URL = 'https://swapi.dev/api'

export const starwarsService = {
  getCharacterDetails: async (ids: number[]): Promise<CharacterProperties[]> => {
    try {
      const characters = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`${API_BASE_URL}/people/${id}/`)
          const character = await res.json()

          const vehicleNames = await Promise.all(
            character.vehicles.map((url: string) =>
              fetch(url)
                .then((res) => res.json())
                .then((v) => v.name),
            ),
          )

          const speciesNames = await Promise.all(
            character.species.map((url: string) =>
              fetch(url)
                .then((res) => res.json())
                .then((s) => s.name),
            ),
          )

          return {
            name: character.name,
            gender: character.gender,
            vehicles: vehicleNames,
            species: speciesNames,
          }
        }),
      )

      return characters
    } catch (error) {
      console.error('Error fetching characters:', error)
      return []
    }
  },
  fetchCharacters: async (page: number = 1): Promise<CharacterProperties[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/people/?page=${page}`)
      const data = await res.json()

      const characterIds = data.results.map((result: { url: string }) => {
        const urlParts = result.url.split('/').filter(Boolean)
        return parseInt(urlParts[urlParts.length - 1], 10)
      })

      return await starwarsService.getCharacterDetails(characterIds)
    } catch (error) {
      console.error('Error fetching characters:', error)
      return []
    }
  },
  searchCharacters: async (searchValue: string): Promise<CharacterProperties[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/people/?search=${searchValue}`)
      const data = await res.json()

      const characterIds = data.results.map((result: { url: string }) => {
        const urlParts = result.url.split('/').filter(Boolean)
        return parseInt(urlParts[urlParts.length - 1], 10)
      })

      return await starwarsService.getCharacterDetails(characterIds)
    } catch (error) {
      console.error('Error searching characters:', error)
      return []
    }
  },
  fetchVehicles: async (): Promise<string[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles/`)
      const data = await res.json()
      return data.results.map((vehicle: { name: string }) => vehicle.name)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      return []
    }
  },
  fetchSpecies: async (): Promise<string[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/species/`)
      const data = await res.json()
      return data.results.map((species: { name: string }) => species.name)
    } catch (error) {
      console.error('Error fetching species:', error)
      return []
    }
  },
  fetchPeopleByVehicle: async (vehicleName: string): Promise<CharacterProperties[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles/`)
      const data = await res.json()
      const vehicle = data.results.find((v: { name: string }) => v.name === vehicleName)

      if (!vehicle) return []

      const peopleIds = vehicle.pilots.map((url: string) => {
        const urlParts = url.split('/').filter(Boolean)
        return parseInt(urlParts[urlParts.length - 1], 10)
      })

      return await starwarsService.getCharacterDetails(peopleIds)
    } catch (error) {
      console.error('Error fetching people by vehicle:', error)
      return []
    }
  },
  fetchPeopleBySpecies: async (speciesName: string): Promise<CharacterProperties[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/species/`)
      const data = await res.json()
      const species = data.results.find((s: { name: string }) => s.name === speciesName)

      if (!species) return []

      const peopleIds = species.people.map((url: string) => {
        const urlParts = url.split('/').filter(Boolean)
        return parseInt(urlParts[urlParts.length - 1], 10)
      })

      return await starwarsService.getCharacterDetails(peopleIds)
    } catch (error) {
      console.error('Error fetching people by species:', error)
      return []
    }
  },
}
