import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeSquadronDrawingFunction} from "../squadronDrawingFunction";

import {distributionGroups} from "modules/common/distributionGroups";
import {itemSlot} from "modules/space/src/items/itemSlot";

import
{
  initialGuard,
} from "modules/space/src/passiveskills/passiveSkills";
import { getUnitIconSrc } from "modules/space/assets/units/unitAssets";
import { localize } from "modules/space/localization/localize";
import { moneyResource } from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/common/availabilityFlags";
import { standby } from "modules/common/src/combat/abilities/standby";
import { guardRow } from "modules/common/src/combat/abilities/guardRow";
import { rangedAttack } from "../../combat/abilities/rangedAttack";


export const shieldBoat: UnitTemplate =
{
  type: "shieldBoat",
  get displayName()
  {
    return localize("shieldBoat_displayName").toString();
  },
  get description()
  {
    return localize("shieldBoat_description").toString();
  },
  archetype: unitArchetypes.defence,
  unitDrawingFN: makeSquadronDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "shieldBoat.png",
  ),
  isSquadron: true,
  buildCost:
{
  [moneyResource.type]: 200,
},
  getIconSrc: getUnitIconSrc.bind(null, "sh"),
  maxHealthLevel: 0.9,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.9,
    intelligence: 0.6,
    speed: 0.4,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        guardRow,
        standby,
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
