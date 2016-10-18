import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import defaultUnitDrawingFunction from "../../defaultunits/defaultUnitDrawingFunction";
import * as UnitArchetypes from "../../defaultunits/UnitArchetypes";
import * as UnitFamilies from "../../defaultunits/UnitFamilies";

import * as CommonAbility from "../../common/abilitytemplates/abilities";
import itemSlot from "../../common/itemSlot";


import * as DroneAbility from "../abilities";

export const droneBase: UnitTemplate =
{
  type: "droneBase",
  displayName: "Drone Base",
  description: "Base o drones",

  archetype: undefined,
  families: undefined,
  cultures: [],
  sprite:
  {
    imageSrc: "",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
  icon: "",
  unitDrawingFN: defaultUnitDrawingFunction,

  isSquadron: true,
  buildCost: 200,

  maxHealth: 1.0,
  maxMovePoints: 1,
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
};
