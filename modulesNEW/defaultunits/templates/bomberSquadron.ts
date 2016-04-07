import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate.d.ts";

import * as UnitArchetypes from "../unitArchetypes.ts";
import * as UnitFamilies from "../unitFamilies.ts";
import defaultUnitDrawingFunction from "../defaultUnitDrawingFunction.ts";

import
{
  rangedAttack,
  standBy,
  bombAttack
} from "../../common/abilitytemplates/abilities.ts";

const bomberSquadron: UnitTemplate =
{
  type: "bomberSquadron",
  displayName: "Bomber Squadron",
  description: "Can damage multiple targets with special bomb attack",
  archetype: UnitArchetypes.combat,
  families: [UnitFamilies.basic],
  cultures: [],
  sprite:
  {
    imageSrc: "bomber.png",
    anchor: {x: 0.5, y: 0.5}
  },
  isSquadron: true,
  buildCost: 200,
  icon: "modules\/default\/img\/unitIcons\/fb.png",
  maxHealth: 0.5,
  maxMovePoints: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.7,
    defence: 0.4,
    intelligence: 0.5,
    speed: 0.8
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        bombAttack,
        standBy
      ]
    }
  ],
  unitDrawingFN: defaultUnitDrawingFunction
}

export default bomberSquadron;
