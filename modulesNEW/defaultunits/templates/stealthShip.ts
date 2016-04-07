import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities.ts";

const stealthShip: UnitTemplate =
{
  type: "stealthShip",
  displayName: "Stealth Ship",
  description: "Weak ship that is undetectable by regular vision",
  archetype: UnitArchetypes.scouting,
  families: [UnitFamilies.debug],
  cultures: [],
  sprite:
  {
    imageSrc: "scout.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: true,
  buildCost: 500,
  icon: "modules\/default\/img\/unitIcons\/sc.png",
  maxHealth: 0.6,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  isStealthy: true,
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

export default stealthShip;
