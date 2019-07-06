import {UnitTemplate} from "../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../../space/units/defaultUnitDrawingFunction";

import * as CommonAbility from "../../space/abilities/abilities";
import {distributionGroups} from "../../common/distributionGroups";

import * as DroneAbility from "../abilities";


export const droneCommander: UnitTemplate =
{
  type: "droneCommander",
  displayName: "Drone Commander",
  description: "Commander o drones",

  archetype: unitArchetypes.utility,
  getIconSrc: () => "img/placeholder.png",
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "img/placeholder.png"
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
        DroneAbility.assimilate,
        DroneAbility.repair,
        CommonAbility.standBy,
      ],
    },
    {
      flatProbability: 0.25,
      probabilityItems: [DroneAbility.infest],
    },
  ],
  possibleLearnableAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems: [DroneAbility.infest],
    },
  ],
  itemSlots: {},
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.rare],
  },
};
