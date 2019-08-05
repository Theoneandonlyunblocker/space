import {UnitTemplate} from "../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../../space/units/defaultUnitDrawingFunction";

import * as CommonAbility from "../../space/abilities/abilities";
import {distributionGroups} from "../../common/distributionGroups";
import {getAssetSrc} from "../../common/assets";

import * as DroneAbility from "../abilities";


export const droneBase: UnitTemplate =
{
  type: "droneBase",
  displayName: "Drone Base",
  description: "Base o drones",

  archetype: unitArchetypes.utility,
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
  unitDrawingFN:  makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    getAssetSrc.bind(null, "placeHolder"),
  ),

  isSquadron: false,
  buildCost: 500,
  kind: "unit",

  maxHealthLevel: 1.0,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.7,
    defence: 0.9,
    intelligence: 0.8,
    speed: 0.6,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        DroneAbility.assimilate,
        CommonAbility.standBy,
      ],
    },
    {
      flatProbability: 1,
      probabilityItems:
      [
        {
          flatProbability: 0.5,
          probabilityItems: [DroneAbility.repair],
        },
        {
          flatProbability: 0.5,
          probabilityItems: [DroneAbility.massRepair],
        },
      ],
    },
  ],
  itemSlots: {},
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.unique],
  },
};
