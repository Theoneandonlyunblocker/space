import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeSquadronDrawingFunction} from "../squadronDrawingFunction";

import
{
  bombAttack,
  rangedAttack,
  standBy,
} from "modules/space/src/abilities/abilities";
import {distributionGroups} from "modules/common/distributionGroups";
import {itemSlot} from "modules/space/src/items/itemSlot";
import { localize } from "modules/space/localization/localize";
import { getUnitIconSrc } from "modules/space/assets/units/unitAssets";
import { moneyResource } from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/common/availabilityFlags";


export const bomberSquadron: UnitTemplate =
{
  type: "bomberSquadron",
  get displayName()
  {
    return localize("bomberSquadron_displayName").toString();
  },
  get description()
  {
    return localize("bomberSquadron_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeSquadronDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "bomber.png",
  ),
  isSquadron: true,
  buildCost:
{
  [moneyResource.type]: 200,
},
  getIconSrc: getUnitIconSrc.bind(null, "fb"),
  maxHealthLevel: 0.5,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.7,
    defence: 0.4,
    intelligence: 0.5,
    speed: 0.8,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        bombAttack,
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
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
