
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

export async function getCharactersWithDetails(): Promise<CharacterProperties[]> {
  try {
    const res = await fetch("https://swapi.dev/api/people/?page=1");
    const data = await res.json();
    const characters: { name: string; gender: string; vehicles: string[]; species: string[] }[] = data.results;

    console.log(characters)

    const enriched = await Promise.all(characters.map(async (person: { name: string; gender: string; vehicles: string[]; species: string[] }) => {

      const vehicleNames = await Promise.all(
        person.vehicles.map(url =>
          fetch(url).then(res => res.json()).then(v => v.name)
        )
      );

      const speciesNames = await Promise.all(
        person.species.map(url =>
          fetch(url).then(res => res.json()).then(s => s.name)
        )
      );

      return {
        name: person.name,
        gender: person.gender,
        vehicles: vehicleNames,
        species: speciesNames
      };
    }));

    console.log(enriched);
    return enriched;
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
}
