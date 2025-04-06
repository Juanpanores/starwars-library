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
        const person = await res.json();

        const vehicleNames = await Promise.all(
          person.vehicles.map((url: string) =>
            fetch(url).then(res => res.json()).then(v => v.name)
          )
        );

        const speciesNames = await Promise.all(
          person.species.map((url: string) =>
            fetch(url).then(res => res.json()).then(s => s.name)
          )
        );

        return {
          name: person.name,
          gender: person.gender,
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

export async function fetchCharacters(ids: number[] = []): Promise<CharacterProperties[]> {
  try {
    const characterIds = ids.length > 0 ? ids : Array.from({ length: 10 }, (_, i) => i + 1); // Use provided IDs or default to 1-10
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
