import { UnitTemplate } from "core/src/templateinterfaces/UnitTemplate";
import { localize } from "modules/space/localization/localize";
import * as unitArchetypes from "modules/common/unitArchetypes";
import {getAssetSrc} from "modules/common/assets";
import { makeDefaultUnitDrawingFunctionForPlaceholder } from "../defaultUnitDrawingFunction";
import { moneyResource } from "modules/money/src/moneyResource";
import
{
  rangedAttack,
  standBy,
} from "modules/space/src/abilities/abilities";
import { itemSlot } from "../../items/itemSlot";



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
  unitDrawingFN: makeDefaultUnitDrawingFunctionForPlaceholder(
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
  kind: "unit",

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
    weight: 0,
    distributionGroups: [],
  },
  mapLevelModifiers:
  [
    {
      key: "miningBarge",
      filter: unit =>
      {
        const locationHasResources = Boolean(unit.fleet.location.resource);
        const locationIsControlledByOwner = unit.fleet.player === unit.fleet.location.owner;

        return locationHasResources && locationIsControlledByOwner;
      },
      propagations:
      {
        localStar:
        [
          {
            key: "localMiningbarge",
            self:
            {
              adjustments:
              {
                mining: {flat: 1},
              },
            },
          },
        ],
      },
    },
  ],
};
