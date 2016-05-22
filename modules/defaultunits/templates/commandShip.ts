import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../unitArchetypes";
import * as UnitFamilies from "../unitFamilies";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy
} from "../../common/abilitytemplates/abilities";

import
{
  initialGuard
} from "../../common/passiveskilltemplates/passiveSkills";

const commandShip: UnitTemplate =
{
  type: "commandShip",
  displayName: "Command Ship",
  description: "todo",
  archetype: UnitArchetypes.utility,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "shieldBoat.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.25, y: 0.5}
  },
  isSquadron: false,
  buildCost: 300,
  icon: "modules/defaultunits/img/icons/sh.png",
  maxHealth: 0.7,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.6,
    intelligence: 0.7,
    speed: 0.6
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        standBy
      ]
    }
  ],
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        initialGuard
      ]
    }
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}

export default commandShip;
