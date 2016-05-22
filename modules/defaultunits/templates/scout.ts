import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../unitArchetypes";
import * as UnitFamilies from "../unitFamilies";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities";

const scout: UnitTemplate =
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
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.25, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules/defaultunits/img/icons/sc.png",
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

export default scout;
