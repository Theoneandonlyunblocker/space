import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeSingleUnitDrawingFunctionForPlaceholder} from "modules/space/src/units/singleUnitDrawingFunction";

import {standby} from "modules/common/src/combat/abilities/standby";
import {distributionGroups} from "modules/common/distributionGroups";
import {getAssetSrc} from "modules/common/assets";
import {moneyResource} from "modules/money/src/moneyResource";

import {assimilate} from "../combat/abilities/assimilate";
import {repair} from "../combat/abilities/repair";
import {infest} from "../combat/abilities/infest";
import { localize } from "../../localization/localize";
import { availabilityFlags } from "../availabilityFlags";


export const droneCommander: UnitTemplate =
{
  type: "droneCommander",
  get displayName()
  {
    return localize("droneCommander_displayName").toString();
  },
  get description()
  {
    return localize("droneCommander_description").toString();
  },
  archetype: unitArchetypes.utility,
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
  unitDrawingFN: makeSingleUnitDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "droneCommander",
  ),

  isSquadron: false,
  buildCost:
  {
    [moneyResource.type]: 200,
  },

  maxHealthLevel: 0.75,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.7,
    defence: 0.5,
    intelligence: 0.5,
    speed: 0.7,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        assimilate,
        repair,
        standby,
      ],
    },
    {
      flatProbability: 0.25,
      probabilityItems: [infest],
    },
  ],
  possibleLearnableAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems: [infest],
    },
  ],
  itemSlots: {},
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.rare],
  },
  availabilityData:
  {
    flags: [availabilityFlags.drone],
  },
};
