import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/baselib/unitArchetypes";
import {makeSquadronDrawingFunction} from "../squadronDrawingFunction";

import {distributionGroups} from "modules/baselib/distributionGroups";
import {itemSlot} from "modules/space/src/items/itemSlot";
import { localize } from "modules/space/localization/localize";
import { getUnitIconSrc } from "modules/space/assets/units/unitAssets";
import { moneyResource } from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/availabilityFlags";
import { rangedAttack } from "../../combat/abilities/rangedAttack";
import { beamAttack } from "../../combat/abilities/beamAttack";
import { standby } from "modules/baselib/src/combat/abilities/standby";


export const battleCruiser: UnitTemplate =
{
  type: "battleCruiser",
  get displayName()
  {
    return localize("battleCruiser_displayName").toString();
  },
  get description()
  {
    return localize("battleCruiser_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeSquadronDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "battleCruiser.png",
  ),
  isSquadron: true,
  buildCost:
{
  [moneyResource.type]: 200,
},
  getIconSrc: getUnitIconSrc.bind(null, "bc"),
  maxHealthLevel: 1,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.8,
    defence: 0.8,
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
        beamAttack,
        standby,
      ],
    },
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 2,
  },
  distributionData:
  {
    weight: 1,
    distributionGroups:
    [
      distributionGroups.common,
      distributionGroups.rare,
      distributionGroups.unique,
    ],
  },
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
