import {UnitTemplate} from "../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunctionForPlaceholder} from "../../space/units/defaultUnitDrawingFunction";

import * as CommonAbility from "../../space/abilities/abilities";
import {distributionGroups} from "../../common/distributionGroups";
import {getAssetSrc} from "../../common/assets";

import {assimilate} from "../abilities/assimilate";
import {repair} from "../abilities/repair";
import {infest} from "../abilities/infest";


export const droneCommander: UnitTemplate =
{
  type: "droneCommander",
  displayName: "Drone Commander",
  description: "Commander o drones",

  archetype: unitArchetypes.utility,
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
  unitDrawingFN: makeDefaultUnitDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "droneCommander",
  ),

  isSquadron: false,
  buildCost: 200,
  kind: "unit",

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
        CommonAbility.standBy,
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
};
