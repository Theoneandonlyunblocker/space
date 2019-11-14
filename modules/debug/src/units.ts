import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeDefaultUnitDrawingFunctionForPlaceholder} from "modules/space/src/units/defaultUnitDrawingFunction";

import
{
  boardingHook,
  bombAttack,
  closeAttack,
  guardRow,
  rangedAttack,
  snipeAttack,
  snipeDefence,
  snipeIntelligence,
  snipeSpeed,
  standBy,
} from "modules/space/src/abilities/abilities";
import {itemSlot} from "modules/space/src/items/itemSlot";

import
{
  autoHeal,
  medic,
  warpJammer,
} from "modules/space/src/passiveskills/passiveSkills";
import { localize } from "../localization/localize";
import {getAssetSrc} from "modules/common/assets";
import { moneyResource } from "modules/money/src/moneyResource";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import { debugAbility } from "./abilities";


export const debugShip: UnitTemplate =
{
  type: "debugShip",
  get displayName()
  {
    return localize("debugShip_displayName").toString();
  },
  get description()
  {
    return localize("debugShip_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeDefaultUnitDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "debugShip",
  ),
  isSquadron: false,
  buildCost:
{
  [moneyResource.type]: 0,
},
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
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
    distributionGroups: [],
  },
  availabilityData:
  {
    flags: [coreAvailabilityFlags.alwaysInDebugMode],
  },
  mapLevelModifiers:
  [
    {
      key: "debugShip",
      propagations:
      {
        localStar:
        [
          {
            key: "localDebugShip",
            self:
            {
              income:
              {
                [moneyResource.type]: {additiveMultiplier: 10},
              },
            },
          },
        ],
      },
    },
  ],
};
