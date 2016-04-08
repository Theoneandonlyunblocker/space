import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  wholeRowAttack,
  standBy
} from "../../common/abilitytemplates/abilities.ts";

const battleCruiser: UnitTemplate =
{
  type: "battleCruiser",
  displayName: "Battlecruiser",
  description: "Strong combat ship with low speed",
  archetype: UnitArchetypes.combat,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "battleCruiser.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules\/defaultunits\/img\/icons\/bc.png",
  maxHealth: 1,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.8,
    defence: 0.8,
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
        wholeRowAttack,
        standBy
      ]
    }
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}

export default battleCruiser;
