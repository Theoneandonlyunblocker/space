import { EnglishName } from "modules/englishlanguage/src/EnglishName";
// import { Name } from "core/src/localization/Name";


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
  // unitName: (unitDisplayName: Name, num: number) =>
  // {
  //   const baseName = `${unitDisplayName.toString()} #${num}`;

  //   return new EnglishName(baseName, unitDisplayName.languageSpecificTags);
  // },
};
