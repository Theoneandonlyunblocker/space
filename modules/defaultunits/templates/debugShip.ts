import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../UnitArchetypes";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  boardingHook,
  bombAttack,
  closeAttack,
  debugAbility,
  guardRow,
  rangedAttack,
  snipeAttack,
  snipeDefence,
  snipeIntelligence,
  snipeSpeed,
  standBy,
} from "../../common/abilitytemplates/abilities";
import {distributionGroups} from "../../common/distributionGroups";
import itemSlot from "../../common/itemSlot";

import
{
  autoHeal,
  medic,
  warpJammer
} from "../../common/passiveskilltemplates/passiveSkills";

const debugShip: UnitTemplate =
{
  type: "debugShip",
  displayName: "Debug Ship",
  description: "debug",
  archetype: UnitArchetypes.combat,
  sprite:
  {
    imageSrc: "debugShip.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5}
  },
  isSquadron: false,
  buildCost: 0,
  icon: "modules/defaultunits/img/icons/f.png",
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
        standBy,
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
    },
    {
      flatProbability: 1,
      probabilityItems:
      [
        {weight: 0.25, probabilityItems: [snipeAttack]},
        {weight: 0.25, probabilityItems: [snipeDefence]},
        {weight: 0.25, probabilityItems: [snipeIntelligence]},
        {weight: 0.25, probabilityItems: [snipeSpeed]},
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
          probabilityItems: [autoHeal]
        },
        {
          weight: 0.33,
          probabilityItems: [warpJammer]
        },
        {
          weight: 0.33,
          probabilityItems: [medic]
        }
      ]
    }
  ],
  learnableAbilities:
  [
    guardRow,
    closeAttack
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
    weight: 0,
    distributionGroups: [distributionGroups.debugModeOnly],
  }
}

export default debugShip;
