import {UnitTemplate} from "src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy,
} from "modules/space/abilities/abilities";
import {distributionGroups} from "modules/common/distributionGroups";
import {itemSlot} from "modules/space/items/itemSlot";
import {getIconSrc} from "../resources";
import { localize } from "../localization/localize";


export const scout: UnitTemplate =
{
  type: "scout",
  get displayName()
  {
    return localize("scout_displayName").toString();
  },
  get description()
  {
    return localize("scout_description").toString();
  },
  archetype: unitArchetypes.scouting,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "scout.png",
  ),
  isSquadron: true,
  buildCost: 200,
  kind: "unit",
  getIconSrc: getIconSrc.bind(null, "sc"),
  maxHealthLevel: 0.6,
  maxMovePoints: 2,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 2,
  detectionRange: 0,
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
  distributionData:
  {
    weight: 1,
    distributionGroups:
    [
      distributionGroups.common,
      distributionGroups.rare,
    ],
  },
};
