import { TitanChassisTemplate } from "modules/titans/src/TitanChassisTemplate";
import * as unitArchetypes from "modules/baselib/src/unitArchetypes";
import {makeSingleUnitDrawingFunction} from "modules/space/src/units/singleUnitDrawingFunction";

import {itemSlot} from "modules/space/src/items/itemSlot";

import { localize } from "../localization/localize";
import {getAssetSrc} from "modules/baselib/assets/assets";
import { moneyResource } from "modules/money/src/moneyResource";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import {standby} from "modules/baselib/src/combat/abilities/standby";
import { rangedAttack } from "modules/space/src/combat/abilities/rangedAttack";


export const debugChassis: TitanChassisTemplate =
{
  type: "debugChassis",
  get displayName()
  {
    return localize("debugChassis_displayName");
  },
  get description()
  {
    return localize("debugChassis_description");
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeSingleUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "debugShip.png",
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
        rangedAttack,
        standby,
      ],
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
};
export const debugChassis2: TitanChassisTemplate =
{
  type: "debugChassis2",
  get displayName()
  {
    return localize("debugChassis2_displayName");
  },
  get description()
  {
    return localize("debugChassis2_description");
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeSingleUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "shieldBoat.png",
  ),
  isSquadron: false,
  buildCost:
{
  [moneyResource.type]: 0,
},
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
  maxHealthLevel: 1,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: 0,
  attributeLevels:
  {
    attack: 1,
    defence: 1,
    intelligence: 1,
    speed: 1,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        standby,
      ],
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
};
