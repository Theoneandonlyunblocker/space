import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeSquadronDrawingFunctionForPlaceholder} from "modules/space/src/units/squadronDrawingFunction";

import * as CommonAbility from "modules/space/src/abilities/abilities";
import {distributionGroups} from "modules/common/distributionGroups";
import {getAssetSrc} from "modules/common/assets";
import {moneyResource} from "modules/money/src/moneyResource";

import {assimilate} from "../combat/abilities/assimilate";
import {merge} from "../combat/abilities/merge";
import { localize } from "../../localization/localize";
import { availabilityFlags } from "../availabilityFlags";


export const droneSwarm: UnitTemplate =
{
  type: "droneSwarm",
  get displayName()
  {
    return localize("droneCommander_displayName").toString();
  },
  get description()
  {
    return localize("droneCommander_description").toString();
  },
  archetype: unitArchetypes.combat,
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
  unitDrawingFN: makeSquadronDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "droneSwarm",
  ),

  isSquadron: true,
  buildCost:
  {
    [moneyResource.type]: 150,
  },

  maxHealthLevel: 0.6,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.6,
    defence: 0.4,
    intelligence: 0.4,
    speed: 0.6,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        assimilate,
        CommonAbility.standBy,
      ],
    },
    {
      flatProbability: 0.25,
      probabilityItems: [merge],
    },
  ],
  possibleLearnableAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems: [merge],
    },
  ],
  itemSlots: {},
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.common],
  },
  availabilityData:
  {
    flags: [availabilityFlags.drone],
  },
};
