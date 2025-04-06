export type CharacterProperties = {
  name: string;
  gender: string;
  vehicles: string[];
  species: string[];
};

export type VehicleProperties = {
  name: string;
};

export type SpeciesProperties = {
  name: string;
};

export type ApiResponse<T> = {
  result: {
    properties: T;
  };
};

export async function getCharacterDetails(ids: number[]): Promise<CharacterProperties[]> {
  try {
    const characters = await Promise.all(
      ids.map(async (id) => {
        const res = await fetch(`https://swapi.dev/api/people/${id}/`);
        const character = await res.json();

        const vehicleNames = await Promise.all(
          character.vehicles.map((url: string) =>
            fetch(url).then(res => res.json()).then(v => v.name)
          )
        );

        const speciesNames = await Promise.all(
          character.species.map((url: string) =>
            fetch(url).then(res => res.json()).then(s => s.name)
          )
        );

        return {
          name: character.name,
          gender: character.gender,
          vehicles: vehicleNames,
          species: speciesNames
        };
      })
    );

    return characters;
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
}

export async function fetchCharacters(page: number = 1): Promise<CharacterProperties[]> {
  try {
    const res = await fetch(`https://swapi.dev/api/people/?page=${page}`);
    const data = await res.json();

    const characterIds = data.results.map((result: { url: string }) => {
      const urlParts = result.url.split('/').filter(Boolean);
      return parseInt(urlParts[urlParts.length - 1], 10); // Extract ID from URL
    });

    return await getCharacterDetails(characterIds);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
}

export async function searchCharacters(searchValue: string): Promise<CharacterProperties[]> {
  try {
    const res = await fetch(`https://swapi.dev/api/people/?search=${searchValue}`);
    const data = await res.json();

    const characterIds = data.results.map((result: { url: string }) => {
      const urlParts = result.url.split('/').filter(Boolean);
      return parseInt(urlParts[urlParts.length - 1], 10); // Extract ID from URL
    });

    return await getCharacterDetails(characterIds);
  } catch (error) {
    console.error("Error searching characters:", error);
    return [];
  }
}

export async function fetchVehicles(): Promise<string[]> {
  try {
    const res = await fetch('https://swapi.dev/api/vehicles/');
    const data = await res.json();
    return data.results.map((vehicle: { name: string }) => vehicle.name);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

export async function fetchSpecies(): Promise<string[]> {
  try {
    const res = await fetch('https://swapi.dev/api/species/');
    const data = await res.json();
    return data.results.map((species: { name: string }) => species.name);
  } catch (error) {
    console.error("Error fetching species:", error);
    return [];
  }
}

export async function fetchPeopleByVehicle(vehicleName: string): Promise<CharacterProperties[]> {
  try {
    const res = await fetch('https://swapi.dev/api/vehicles/');
    const data = await res.json();
    const vehicle = data.results.find((v: { name: string }) => v.name === vehicleName);

    if (!vehicle) return [];

    const peopleIds = vehicle.pilots.map((url: string) => {
      const urlParts = url.split('/').filter(Boolean);
      return parseInt(urlParts[urlParts.length - 1], 10);
    });

    return await getCharacterDetails(peopleIds);
  } catch (error) {
    console.error("Error fetching people by vehicle:", error);
    return [];
  }
}

export async function fetchPeopleBySpecies(speciesName: string): Promise<CharacterProperties[]> {
  try {
    const res = await fetch('https://swapi.dev/api/species/');
    const data = await res.json();
    const species = data.results.find((s: { name: string }) => s.name === speciesName);

    if (!species) return [];

    const peopleIds = species.people.map((url: string) => {
      const urlParts = url.split('/').filter(Boolean);
      return parseInt(urlParts[urlParts.length - 1], 10);
    });

    return await getCharacterDetails(peopleIds);
  } catch (error) {
    console.error("Error fetching people by species:", error);
    return [];
  }
}
