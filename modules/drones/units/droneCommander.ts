import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import defaultUnitDrawingFunction from "../../defaultunits/defaultUnitDrawingFunction";
import * as UnitArchetypes from "../../defaultunits/UnitArchetypes";

import * as CommonAbility from "../../common/abilitytemplates/abilities";
import {distributionGroups} from "../../common/distributionGroups";

import * as DroneAbility from "../abilities";

export const droneCommander: UnitTemplate =
{
  type: "droneCommander",
  displayName: "Drone Commander",
  description: "Commander o drones",

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
  buildCost: 200,

  maxHealth: 0.75,
  maxMovePoints: 1,
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
  learnableAbilities:
  [
    DroneAbility.infest,
  ],
  itemSlots: {},
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.rare],
  },
};
