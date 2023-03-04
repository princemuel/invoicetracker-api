const favoritePets = [
  { id: 154, name: 'Boony' },
  { id: 143, name: 'Simba' },
  { id: 25, name: 'Pinky' },
];
const favoriteThings = [
  { id: 73, name: 'Phone' },
  { id: 29, name: 'Sunflower' },
  { id: 45, name: 'Computer' },
];

const petsMap = new Map([...favoritePets.map((pet) => [pet.id, pet] as const)]);

const petExistsInThing = favoriteThings.some((thing) => petsMap.has(thing.id));
