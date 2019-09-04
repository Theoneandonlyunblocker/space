import {UnitTemplate} from "../../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

import
{
  beamAttack,
  rangedAttack,
  standBy,
} from "../../abilities/abilities";
import {distributionGroups} from "../../../common/distributionGroups";
import {itemSlot} from "../../items/itemSlot";
import {getIconSrc} from "../resources";
import { localize } from "../localization/localize";


export const battleCruiser: UnitTemplate =
{
  type: "battleCruiser",
  get displayName()
  {
    return localize("battleCruiser_displayName").toString();
  },
  get description()
  {
    return localize("battleCruiser_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "battleCruiser.png",
  ),
  isSquadron: true,
  buildCost: 200,
  kind: "unit",
  getIconSrc: getIconSrc.bind(null, "bc"),
  maxHealthLevel: 1,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.8,
    defence: 0.8,
    intelligence: 0.7,
    speed: 0.6,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        beamAttack,
        standBy,
      ],
    },
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 1,
    [itemSlot.high]: 2,
  },
  distributionData:
  {
    weight: 1,
    distributionGroups:
    [
      distributionGroups.common,
      distributionGroups.rare,
      distributionGroups.unique,
    ],
  },
};
