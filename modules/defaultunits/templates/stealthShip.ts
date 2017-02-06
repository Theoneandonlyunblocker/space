import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../UnitArchetypes";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy,
} from "../../common/abilitytemplates/abilities";
import {distributionGroups} from "../../common/distributionGroups";
import itemSlot from "../../common/itemSlot";

const stealthShip: UnitTemplate =
{
  type: "stealthShip",
  displayName: "Stealth Ship",
  description: "Weak ship that is undetectable by regular vision",
  archetype: UnitArchetypes.scouting,
  sprite:
  {
    imageSrc: "scout.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
  isSquadron: true,
  buildCost: 500,
  icon: "modules/defaultunits/img/icons/sc.png",
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
    speed: 0.7,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        standBy,
      ],
    },
  ],

  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 1,
  },
  unitDrawingFN: defaultUnitDrawingFunction,
  distributionData:
  {
    weight: 1,
    distributionGroups:
    [
      distributionGroups.rare,
      distributionGroups.unique,
    ],
  },
}

export default stealthShip;
