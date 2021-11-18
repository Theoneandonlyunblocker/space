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
import { closeAttack } from "../../combat/abilities/closeAttack";


export const fighterSquadron: UnitTemplate =
{
  key: "fighterSquadron",
  get displayName()
  {
    return localize("fighterSquadron_displayName").toString();
  },
  get description()
  {
    return localize("fighterSquadron_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeSquadronDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "fighter.png",
  ),
  isSquadron: true,
  buildCost:
{
  [moneyResource.key]: 100,
},
  getIconSrc: getUnitIconSrc.bind(null, "fa"),
  maxHealthLevel: 0.7,
  maxMovePoints: 2,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.8,
    defence: 0.6,
    intelligence: 0.4,
    speed: 1,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        closeAttack,
        standby,
      ],
    },
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 3,
    [itemSlot.high]: 2,
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
