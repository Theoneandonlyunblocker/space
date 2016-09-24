import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../UnitArchetypes";
import * as UnitFamilies from "../UnitFamilies";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import itemSlot from "../../common/itemSlot";
import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities";

const blueShip: UnitTemplate =
{
  type: "blueShip",
  displayName: "Blue ship",
  description: "Just used for testing unit distribution. (all the other units are just for testing something too)",
  archetype: UnitArchetypes.utility,
  families: [UnitFamilies.blue],
  cultures: [],
  sprite:
  {
    imageSrc: "scout.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5}
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
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 1,
  },
  unitDrawingFN: defaultUnitDrawingFunction
}

export default blueShip;
