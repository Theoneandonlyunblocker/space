import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities.ts";

export var scout: UnitTemplate =
{
  type: "scout",
  displayName: "Scout",
  description: "Weak in combat, but has high vision and can reveal stealthy units and details of units in same star",
  archetype: UnitArchetypes.scouting,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "scout.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules\/default\/img\/unitIcons\/sc.png",
  maxHealth: 0.6,
  maxMovePoints: 2,
  visionRange: 2,
  detectionRange: 0,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.5,
    intelligence: 0.8,
    speed: 0.7
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        standBy
      ]
    }
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}
