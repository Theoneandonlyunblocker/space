import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../unitArchetypes";
import * as UnitFamilies from "../unitFamilies";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities";

const redShip: UnitTemplate =
{
  type: "redShip",
  displayName: "Red ship",
  description: "Just used for testing unit distribution. (all the other units are just for testing something too)",
  archetype: UnitArchetypes.utility,
  families: [UnitFamilies.red],
  cultures: [],
  sprite:
  {
    imageSrc: "scout.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules\/defaultunits\/img\/icons\/sc.png",
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

export default redShip;
