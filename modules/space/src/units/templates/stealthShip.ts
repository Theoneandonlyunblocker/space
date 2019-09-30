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

import * as technologies from "modules/space/src/technologies/technologyTemplates";
import { getUnitIconSrc } from "modules/space/assets/units/unitAssets";
import { localize } from "modules/space/localization/localize";


export const stealthShip: UnitTemplate =
{
  type: "stealthShip",
  get displayName()
  {
    return localize("stealthShip_displayName").toString();
  },
  get description()
  {
    return localize("stealthShip_description").toString();
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
  buildCost: 500,
  kind: "unit",
  getIconSrc: getUnitIconSrc.bind(null, "sc"),
  maxHealthLevel: 0.6,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
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
  techRequirements:
  [
    {
      technology: technologies.stealth,
      level: 2,
    }
  ],
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