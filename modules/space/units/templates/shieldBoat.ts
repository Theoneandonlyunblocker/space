import {UnitTemplate} from "../../../../src/templateinterfaces/UnitTemplate";

import * as unitArchetypes from "../../../common/unitArchetypes";
import {makeDefaultUnitDrawingFunction} from "../defaultUnitDrawingFunction";

import
{
  guardRow,
  rangedAttack,
  standBy,
} from "../../abilities/abilities";
import {distributionGroups} from "../../../common/distributionGroups";
import {itemSlot} from "../../items/itemSlot";

import
{
  initialGuard,
} from "../../passiveskills/passiveSkills";
import {getIconSrc} from "../resources";
import { localize } from "../localization/localize";


export const shieldBoat: UnitTemplate =
{
  type: "shieldBoat",
  get displayName()
  {
    return localize("shieldBoat_displayName")();
  },
  get description()
  {
    return localize("shieldBoat_description")();
  },
  archetype: unitArchetypes.defence,
  unitDrawingFN: makeDefaultUnitDrawingFunction(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    () => "shieldBoat.png",
  ),
  isSquadron: true,
  buildCost: 200,
  kind: "unit",
  getIconSrc: getIconSrc.bind(null, "sh"),
  maxHealthLevel: 0.9,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.5,
    defence: 0.9,
    intelligence: 0.6,
    speed: 0.4,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        guardRow,
        standBy,
      ],
    },
  ],
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        initialGuard,
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
      distributionGroups.unique,
    ],
  },
};
