import {Fleet} from "../../src/Fleet";
import Name from "../../src/Name";
import Player from "../../src/Player";
import Star from "../../src/Star";
import Unit from "../../src/Unit";

import
{
  getDistributablesWithGroups,
  getRandomWeightedDistributable,
} from "../../src/templateinterfaces/Distributable";
import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import {distributionGroups} from "./distributionGroups";


type UnitRole = "normal" |
  "elite" |
  "leader";
const unitRoleData:
{
  [role: string]:
  {
    namePrefix: string;
    health: number;
    attributes: number;
    filterCandidates: (candidates: UnitTemplate[]) => UnitTemplate[];
  };
} =
{
  normal:
  {
    namePrefix: "",
    health: 1,
    attributes: 1,
    filterCandidates: candidates =>
    {
      return getDistributablesWithGroups(
        candidates,
        [distributionGroups.common],
      );
    },
  },
  elite:
  {
    namePrefix: "",
    health: 1.2,
    attributes: 1.2,
    filterCandidates: candidates =>
    {
      return getDistributablesWithGroups(
        candidates,
        [distributionGroups.rare],
      );
    },
  },
  leader:
  {
    namePrefix: "",
    health: 1.35,
    attributes: 1.35,
    filterCandidates: candidates =>
    {
      return getDistributablesWithGroups(
        candidates,
        [distributionGroups.unique],
      );
    },
  },
};

export function generateIndependentFleets(
  race: RaceTemplate,
  player: Player,
  location: Star,
  globalStrength: number,
  localStrength: number,
  maxUnitsPerSideInBattle: number,
): Fleet[]
{
  const locationShouldHaveLeader = localStrength > 0.8;

  const allBuildableUnitTypes = race.getBuildableUnits();

  const unitCountFromGlobalStrength = maxUnitsPerSideInBattle * 0.34 + maxUnitsPerSideInBattle * 0.66 * globalStrength;
  const unitCountFromLocalStrength = locationShouldHaveLeader ? 1 : 0;

  const unitCount = Math.min(
    Math.round(unitCountFromGlobalStrength + unitCountFromLocalStrength),
    maxUnitsPerSideInBattle,
  );

  const eliteCount = Math.ceil((unitCount / maxUnitsPerSideInBattle - 0.499) * 3);

  const units: Unit[] = [];
  for (let i = 0; i < unitCount; i++)
  {
    let unitRole: UnitRole;
    if (locationShouldHaveLeader && i === 0)
    {
      unitRole = "leader";
    }
    else if (i < eliteCount)
    {
      unitRole = "elite";
    }
    else
    {
      unitRole = "normal";
    }

    const candidateUnitTemplates = unitRoleData[unitRole].filterCandidates(allBuildableUnitTypes);

    const unitTemplate = getRandomWeightedDistributable(candidateUnitTemplates);

    const healthModifier = unitRoleData[unitRole].health;
    const attributesModifier = unitRoleData[unitRole].attributes;

    const unitName = `${unitRoleData[unitRole].namePrefix}${race.getUnitName(unitTemplate)}`;

    const unit = Unit.fromTemplate(
    {
      template: unitTemplate,
      race: race,

      name: unitName,

      attributeMultiplier: (1 + globalStrength * 0.2) * attributesModifier,
      healthMultiplier: (1 + globalStrength) * healthModifier,
    });

    units.push(unit);
    player.addUnit(unit);
  }

  const fleets = Fleet.createFleetsFromUnits(units);
  fleets.forEach(fleet =>
  {
    player.addFleet(fleet);
    location.addFleet(fleet);
    fleet.name = new Name(`Independent ${race.displayName} Fleet`, false);
  });

  return fleets;
}
