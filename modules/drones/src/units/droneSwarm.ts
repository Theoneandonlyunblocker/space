import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "modules/common/unitArchetypes";
import {makeDefaultUnitDrawingFunctionForPlaceholder} from "modules/space/units/defaultUnitDrawingFunction";

import * as CommonAbility from "modules/space/abilities/abilities";
import {distributionGroups} from "modules/common/distributionGroups";
import {getAssetSrc} from "modules/common/assets";

import {assimilate} from "../abilities/assimilate";
import {merge} from "../abilities/merge";
import { localize } from "../../localization/localize";


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
  unitDrawingFN: makeDefaultUnitDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "droneSwarm",
  ),

  isSquadron: true,
  buildCost: 150,
  kind: "unit",

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
};
