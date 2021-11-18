import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/baselib/src/unitArchetypes";
import {makeSquadronDrawingFunction} from "../squadronDrawingFunction";

import {distributionGroups} from "modules/baselib/src/distributionGroups";
import {itemSlot} from "modules/space/src/items/itemSlot";
import { getUnitIconSrc } from "modules/space/assets/units/unitAssets";
import { localize } from "modules/space/localization/localize";
import { moneyResource } from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { standby } from "modules/baselib/src/combat/abilities/standby";
import { rangedAttack } from "../../combat/abilities/rangedAttack";


export const scout: UnitTemplate =
{
  key: "scout",
  get displayName()
  {
    return localize("scout_displayName").toString();
  },
  get description()
  {
    return localize("scout_description").toString();
  },
  archetype: unitArchetypes.scouting,
  unitDrawingFN: makeSquadronDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "scout.png",
  ),
  isSquadron: true,
  buildCost:
{
  [moneyResource.key]: 200,
},
  getIconSrc: getUnitIconSrc.bind(null, "sc"),
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
    weight: 1,
    distributionGroups:
    [
      distributionGroups.common,
      distributionGroups.rare,
    ],
  },
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
