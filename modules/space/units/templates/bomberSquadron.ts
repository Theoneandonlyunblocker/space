import {UnitTemplate} from "../../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

import
{
  bombAttack,
  rangedAttack,
  standBy,
} from "../../abilities/abilities";
import {distributionGroups} from "../../../common/distributionGroups";
import {itemSlot} from "../../items/itemSlot";
import {getIconSrc} from "../resources";
import { localize } from "../localization/localize";


export const bomberSquadron: UnitTemplate =
{
  type: "bomberSquadron",
  get displayName()
  {
    return localize("bomberSquadron_displayName").toString();
  },
  get description()
  {
    return localize("bomberSquadron_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "bomber.png",
  ),
  isSquadron: true,
  buildCost: 200,
  kind: "unit",
  getIconSrc: getIconSrc.bind(null, "fb"),
  maxHealthLevel: 0.5,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.7,
    defence: 0.4,
    intelligence: 0.5,
    speed: 0.8,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        bombAttack,
        standBy,
      ],
    },
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 1,
  },
  distributionData:
  {
    weight: 1,
    distributionGroups:
    [
      distributionGroups.common,
      distributionGroups.rare,
    ],
  },
};
