import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../UnitArchetypes";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import itemSlot from "../../common/itemSlot";
import
{
  rangedAttack,
  beamAttack,
  standBy
} from "../../common/abilitytemplates/abilities";

const battleCruiser: UnitTemplate =
{
  type: "battleCruiser",
  displayName: "Battlecruiser",
  description: "Strong combat ship with low speed",
  archetype: UnitArchetypes.combat,
  sprite:
  {
    imageSrc: "battleCruiser.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules/defaultunits/img/icons/bc.png",
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
        beamAttack,
        standBy
      ]
    }
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 2,
  },
  unitDrawingFN: defaultUnitDrawingFunction
}

export default battleCruiser;
