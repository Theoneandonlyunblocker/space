import { UnitTemplate } from "core/src/templateinterfaces/UnitTemplate";
import { localize } from "modules/space/localization/localize";
import * as unitArchetypes from "modules/baselib/unitArchetypes";
import {getAssetSrc} from "modules/baselib/assets";
import { makeSquadronDrawingFunctionForPlaceholder } from "../squadronDrawingFunction";
import { moneyResource } from "modules/money/src/moneyResource";
import { itemSlot } from "../../items/itemSlot";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/availabilityFlags";
import { standby } from "modules/baselib/src/combat/abilities/standby";
import { rangedAttack } from "../../combat/abilities/rangedAttack";
import { miner } from "../../passiveskills/passiveSkills";


export const miningBarge: UnitTemplate =
{
  type: "miningBarge",
  get displayName()
  {
    return localize("miningBarge_displayName").toString();
  },
  get description()
  {
    return localize("miningBarge_description").toString();
  },
  archetype: unitArchetypes.economic,
  getIconSrc: getAssetSrc.bind(null, "placeHolder"),
  unitDrawingFN: makeSquadronDrawingFunctionForPlaceholder(
  {
    anchor: {x: 0.5, y: 0.5},
    attackOriginPoint: {x: 0.75, y: 0.5},
  },
    "miningBarge",
  ),
  isSquadron: true,
  buildCost:
  {
    [moneyResource.type]: 500,
  },
  maxHealthLevel: 1,
  maxMovePoints: 1,
  maxOffensiveBattlesPerTurn: 1,
  visionRange: 1,
  detectionRange: -1,
  attributeLevels:
  {
    attack: 0.2,
    defence: 0.4,
    intelligence: 0.5,
    speed: 0.2,
  },
  possibleAbilities:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        rangedAttack,
        standby,
      ],
    },
  ],
  possiblePassiveSkills:
  [
    {
      flatProbability: 1,
      probabilityItems:
      [
        miner,
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
    weight: 0,
    distributionGroups: [],
  },
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
