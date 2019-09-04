import {UnitTemplate} from "../../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

import
{
  closeAttack,
  rangedAttack,
  standBy,
} from "../../abilities/abilities";
import {distributionGroups} from "../../../common/distributionGroups";
import {itemSlot} from "../../items/itemSlot";
import {getIconSrc} from "../resources";
import { localize } from "../localization/localize";


export const fighterSquadron: UnitTemplate =
{
  type: "fighterSquadron",
  get displayName()
  {
    return localize("fighterSquadron_displayName").toString();
  },
  get description()
  {
    return localize("fighterSquadron_description").toString();
  },
  archetype: unitArchetypes.combat,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "fighter.png",
  ),
  isSquadron: true,
  buildCost: 100,
  kind: "unit",
  getIconSrc: getIconSrc.bind(null, "fa"),
  maxHealthLevel: 0.7,
  maxMovePoints: 2,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.8,
    defence: 0.6,
    intelligence: 0.4,
    speed: 1,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        closeAttack,
        standBy,
      ],
    },
  ],
  itemSlots:
  {
    [itemSlot.low]: 1,
    [itemSlot.mid]: 3,
    [itemSlot.high]: 2,
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
