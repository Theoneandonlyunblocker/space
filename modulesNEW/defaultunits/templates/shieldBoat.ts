import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  standBy,
  guardRow
} from "../../common/abilitytemplates/abilities.ts";

import
{
  initialGuard
} from "../../common/passiveskilltemplates/passiveSkills.ts";

const shieldBoat: UnitTemplate =
{
  type: "shieldBoat",
  displayName: "Shield Boat",
  description: "Great defence and ability to protect allies in same row",
  archetype: UnitArchetypes.defence,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "shieldBoat.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules\/default\/img\/unitIcons\/sh.png",
  maxHealth: 0.9,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.9,
    intelligence: 0.6,
    speed: 0.4
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        guardRow,
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

export default shieldBoat;
