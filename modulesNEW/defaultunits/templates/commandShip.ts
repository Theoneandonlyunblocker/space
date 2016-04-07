import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities.ts";

import
{
  initialGuard
} from "../../common/passiveskilltemplates/passiveSkills.ts";

export var commandShip: UnitTemplate =
{
  type: "commandShip",
  displayName: "Command Ship",
  description: "todo",
  archetype: UnitArchetypes.utility,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "shieldBoat.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: false,
  buildCost: 300,
  icon: "modules\/default\/img\/unitIcons\/sh.png",
  maxHealth: 0.7,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.6,
    intelligence: 0.7,
    speed: 0.6
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
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        initialGuard
      ]
    }
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}
