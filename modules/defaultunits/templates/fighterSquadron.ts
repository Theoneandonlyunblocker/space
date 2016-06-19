import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import * as UnitArchetypes from "../unitArchetypes";
import * as UnitFamilies from "../unitFamilies";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction";

import
{
  rangedAttack,
  standBy,
  closeAttack
} from "../../common/abilitytemplates/abilities";

const fighterSquadron: UnitTemplate =
{
  type: "fighterSquadron",
  displayName: "Fighter Squadron",
  description: "Fast and cheap unit with good attack and speed but low defence",
  archetype: UnitArchetypes.combat,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "fighter.png",
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5}
  },
  isSquadron: true,
  buildCost: 100,
  icon: "modules/defaultunits/img/icons/fa.png",
  maxHealth: 0.7,
  maxMovePoints: 2,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.8,
    defence: 0.6,
    intelligence: 0.4,
    speed: 1
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        closeAttack,
        standBy
      ]
    }
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}

export default fighterSquadron;
