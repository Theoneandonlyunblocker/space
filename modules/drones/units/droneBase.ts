import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../../defaultunits/UnitArchetypes";
import defaultUnitDrawingFunction from "../../defaultunits/defaultUnitDrawingFunction";

import * as CommonAbility from "../../common/abilitytemplates/abilities";
import {distributionGroups} from "../../common/distributionGroups";

import * as DroneAbility from "../abilities";


export const droneBase: UnitTemplate =
{
  type: "droneBase",
  displayName: "Drone Base",
  description: "Base o drones",

  archetype: UnitArchetypes.utility,
  sprite:
  {
    imageSrc: "img/placeholder.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
  icon: "img/placeholder.png",
  unitDrawingFN: defaultUnitDrawingFunction,

  isSquadron: false,
  buildCost: 500,
  unlockType: "unit",

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
