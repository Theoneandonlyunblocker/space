import {UnitTemplate} from "../../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

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
} from "../../abilities/abilities";
import {distributionGroups} from "../../../common/distributionGroups";
import {itemSlot} from "../../items/itemSlot";

import
{
  autoHeal,
  medic,
  warpJammer,
} from "../../passiveskills/passiveSkills";
import {getIconSrc} from "../resources";


export const debugShip: UnitTemplate =
{
  type: "debugShip",
  displayName: "Debug Ship",
  description: "debug",
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "debugShip.png",
  ),
  isSquadron: false,
  buildCost: 0,
  kind: "unit",
  getIconSrc: getIconSrc.bind(null, "f"),
  maxHealthLevel: 1,
  maxMovePoints: 999,
  maxOffensiveBattlesPerTurn: 999,
  visionRange: 999,
  detectionRange: 999,
  attributeLevels:
  {
    attack: 9,
    defence: 9,
    intelligence: 9,
    speed: 9,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        debugAbility,
        rangedAttack,
        bombAttack,
        standBy,
      ],
    },
    {
      flatProbability: 1,
      probabilityItems:
      [
        {
          weight: 0.33,
          probabilityItems: [bombAttack],
        },
        {
          weight: 0.33,
          probabilityItems: [boardingHook],
        },
        {
          weight: 0.33,
          probabilityItems: [guardRow],
        },
      ],
    },
    {
      flatProbability: 1,
      probabilityItems:
      [
        {weight: 0.25, probabilityItems: [snipeAttack]},
        {weight: 0.25, probabilityItems: [snipeDefence]},
        {weight: 0.25, probabilityItems: [snipeIntelligence]},
        {weight: 0.25, probabilityItems: [snipeSpeed]},
      ],
    },
  ],
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        {
          weight: 0.33,
          probabilityItems: [autoHeal],
        },
        {
          weight: 0.33,
          probabilityItems: [warpJammer],
        },
        {
          weight: 0.33,
          probabilityItems: [medic],
        },
      ],
    },
  ],
  possibleLearnableAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems: [guardRow, closeAttack],
    },
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 1,
  },
  distributionData:
  {
    weight: 0,
    distributionGroups: [distributionGroups.debugModeOnly],
  },
};
