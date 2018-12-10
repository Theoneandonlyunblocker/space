import UnitTemplate from "../../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../../common/unitArchetypes";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  guardRow,
  rangedAttack,
  standBy,
} from "../../abilities/abilities";
import {distributionGroups} from "../../../common/distributionGroups";
import itemSlot from "../../items/itemSlot";

import
{
  initialGuard,
} from "../../passiveskills/passiveSkills";


const shieldBoat: UnitTemplate =
{
  type: "shieldBoat",
  displayName: "Shield Boat",
  description: "Great defence and ability to protect allies in same row",
  archetype: unitArchetypes.defence,
  sprite:
  {
    imageSrc: "shieldBoat.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
  isSquadron: true,
  buildCost: 200,
  kind: "unit",
  icon: "modules/space/units/img/icons/sh.png",
  maxHealthLevel: 0.9,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.9,
    intelligence: 0.6,
    speed: 0.4,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        guardRow,
        standBy,
      ],
    },
  ],
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        initialGuard,
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
      distributionGroups.common,
      distributionGroups.rare,
      distributionGroups.unique,
    ],
  },
};

export default shieldBoat;
