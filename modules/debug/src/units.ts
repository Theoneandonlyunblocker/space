import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/baselib/src/unitArchetypes";
import {makeSingleUnitDrawingFunctionForPlaceholder} from "modules/space/src/units/singleUnitDrawingFunction";

import {itemSlot} from "modules/space/src/items/itemSlot";


import {passiveSkillTemplates as spacePassiveSkills} from "modules/space/src/passiveskills/passiveSkills";
import { localize } from "../localization/localize";
import {getAssetSrc} from "modules/baselib/assets/assets";
import { moneyResource } from "modules/money/src/moneyResource";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import { debugAbility } from "./abilities";
import { standby } from "modules/baselib/src/combat/abilities/standby";
import { guardRow } from "modules/baselib/src/combat/abilities/guardRow";
import {combatAbilityTemplates as spaceAbilities} from "modules/space/src/combat/combatAbilityTemplates";


export const debugShip: UnitTemplate =
{
  key: "debugShip",
  get displayName()
  {
    return localize("debugShip_displayName");
  },
  get description()
  {
    return localize("debugShip_description");
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeSingleUnitDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "debugShip",
  ),
  isSquadron: false,
  buildCost:
{
  [moneyResource.key]: 0,
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
        spaceAbilities.rangedAttack,
        spaceAbilities.bombAttack,
        standby,
      ],
    },
    {
      flatProbability: 1,
      probabilityItems:
      [
        {
          weight: 0.33,
          probabilityItems: [spaceAbilities.bombAttack],
        },
        {
          weight: 0.33,
          probabilityItems: [spaceAbilities.boardingHook],
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
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeAttack]},
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeDefence]},
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeIntelligence]},
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeSpeed]},
      ],
    },
    {
      flatProbability: 0.6,
      probabilityItems:
      [
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeAttack]},
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeDefence]},
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeIntelligence]},
        {weight: 0.25, probabilityItems: [spaceAbilities.snipeSpeed]},
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
          probabilityItems: [spacePassiveSkills.autoHeal],
        },
        {
          weight: 0.33,
          probabilityItems: [spacePassiveSkills.warpJammer],
        },
        {
          weight: 0.33,
          probabilityItems: [spacePassiveSkills.medic],
        },
      ],
    },
  ],
  possibleLearnableAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems: [guardRow, spaceAbilities.closeAttack],
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
