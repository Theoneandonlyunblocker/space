import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../UnitArchetypes";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import itemSlot from "../../common/itemSlot";
import
{
  rangedAttack,
  standBy,
  bombAttack
} from "../../common/abilitytemplates/abilities";

const bomberSquadron: UnitTemplate =
{
  type: "bomberSquadron",
  displayName: "Bomber Squadron",
  description: "Can damage multiple targets with special bomb attack",
  archetype: UnitArchetypes.combat,
  sprite:
  {
    imageSrc: "bomber.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules/defaultunits/img/icons/fb.png",
  maxHealth: 0.5,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.7,
    defence: 0.4,
    intelligence: 0.5,
    speed: 0.8
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        bombAttack,
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

export default bomberSquadron;
