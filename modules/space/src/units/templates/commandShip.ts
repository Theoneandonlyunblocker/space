import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy,
} from "modules/space/src/abilities/abilities";
import {distributionGroups} from "modules/common/distributionGroups";
import {itemSlot} from "modules/space/src/items/itemSlot";

import
{
  initialGuard,
} from "modules/space/src/passiveskills/passiveSkills";
import { localize } from "modules/space/localization/localize";
import { getUnitIconSrc } from "modules/space/assets/units/unitAssets";


export const commandShip: UnitTemplate =
{
  type: "commandShip",
  get displayName()
  {
    return localize("commandShip_displayName").toString();
  },
  get description()
  {
    return localize("commandShip_description").toString();
  },
  archetype: unitArchetypes.utility,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "shieldBoat.png",
  ),
  isSquadron: false,
  buildCost: 300,
  kind: "unit",
  getIconSrc: getUnitIconSrc.bind(null, "sh"),
  maxHealthLevel: 0.7,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.6,
    intelligence: 0.7,
    speed: 0.6,
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
  distributionData:
  {
    weight: 1,
    distributionGroups:
    [
      distributionGroups.rare,
      distributionGroups.unique,
    ],
  },
};
