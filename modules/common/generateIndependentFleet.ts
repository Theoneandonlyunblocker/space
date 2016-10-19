import Fleet from "../../src/Fleet";
import Name from "../../src/Name";
import Player from "../../src/Player";
import Star from "../../src/Star";
import Unit from "../../src/Unit";

import
{
  getRandomArrayItem,
} from "../../src/utility";

import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";

export function generateIndependentFleet(
  race: RaceTemplate,
  player: Player,
  location: Star,
  globalStrength: number,
  localStrength: number,
  maxUnitsPerSideInBattle: number,
): Fleet
{
  // TODO 19.10.2016 | set distribution flags for unit templates
  // eliteOnly, commanderOnly, etc.
  const allUnitTypes = race.getBuildableUnitTypes(player);

  const unitCountFromGlobalStrength = maxUnitsPerSideInBattle * 0.34 + maxUnitsPerSideInBattle * 0.66 * globalStrength;
  const unitCountFromLocalStrength = localStrength > 0.8 ? 1 : 0;

  const unitCount = Math.min(
    Math.round(unitCountFromGlobalStrength + unitCountFromLocalStrength),
    maxUnitsPerSideInBattle
  );

  const eliteCount = Math.ceil((unitCount / maxUnitsPerSideInBattle - 0.499) * 2);

  const units: Unit[] = [];
  for (let i = 0; i < unitCount; i++)
  {
    const isElite = i < eliteCount;

    const healthModifier = isElite ? 1.2 : 1;
    const statsModifier = isElite ? 1.2 : 1;

    const unitTemplate = getRandomArrayItem(allUnitTypes);
    const unitName = `${isElite ? "Elite " : ""}${race.getUnitName(unitTemplate)}`;

    const unit = Unit.fromTemplate(
    {
      template: unitTemplate,
      race: race,

      name: unitName,

      attributeMultiplier: (1 + globalStrength * 0.2) * statsModifier,
      healthMultiplier: (1 + globalStrength) * healthModifier,
    });

    units.push(unit);
    player.addUnit(unit);
  }

  const fleet = new Fleet(player, units, location, undefined, false);
  fleet.name = new Name(`Independent ${race.displayName} Fleet`, false);

  return fleet;
}
