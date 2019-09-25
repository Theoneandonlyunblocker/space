import { EnglishName } from "modules/englishlanguage/src/EnglishName";


export const names =
{
  drones: () => new EnglishName("Drones", {isPlural: true}),
  swarm: (num: number) => new EnglishName(`Swarm #${num}`),
  droneHost: (num: number) => new EnglishName(`Drone Host #${num}`),
  unitName: (unitDisplayName: string, num: number) =>
  {
    const baseName = `${unitDisplayName} #${num}`;

    return new EnglishName(baseName);
  },
};
