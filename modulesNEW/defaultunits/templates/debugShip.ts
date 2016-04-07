import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  standBy,
  debugAbility,
  bombAttack,
  guardRow,
  boardingHook,
  closeAttack
} from "../../common/abilitytemplates/abilities.ts";

const debugShip: UnitTemplate =
{
  type: "debugShip",
  displayName: "Debug Ship",
  description: "debug",
  archetype: UnitArchetypes.combat,
  families: [UnitFamilies.debug],
  cultures: [],
  sprite:
  {
    imageSrc: "debugShip.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: false,
  buildCost: 0,
  icon: "modules\/default\/img\/unitIcons\/f.png",
  maxHealth: 1,
  maxMovePoints: 999,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 9,
    defence: 9,
    intelligence: 9,
    speed: 9
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        debugAbility,
        rangedAttack,
        standBy
      ]
    },
    {
      flatProbability: 1,
      probabilityItems:
      [
        {
          weight: 0.33,
          probabilityItems: [bombAttack]
        },
        {
          weight: 0.33,
          probabilityItems: [boardingHook]
        },
        {
          weight: 0.33,
          probabilityItems: [guardRow]
        }
      ]
    }
  ],
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        {
          weight: 0.33,
          probabilityItems: [PassiveSkills.autoHeal]
        },
        {
          weight: 0.33,
          probabilityItems: [PassiveSkills.warpJammer]
        },
        {
          weight: 0.33,
          probabilityItems: [PassiveSkills.medic]
        }
      ]
    }
  ],
  specialAbilityUpgrades:
  [
    ranceAttack
  ],
  learnableAbilities:
  [
    guardRow,
    closeAttack,
    [debugAbility, ranceAttack]
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}

export default debugShip;
