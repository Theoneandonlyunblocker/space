import {BuildUnitsForFront as BuildUnitsForFront} from "../objectives/BuildUnitsForFront";
import {CleanUpPirates as CleanUpPirates} from "../objectives/CleanUpPirates";
import {Conquer as Conquer} from "../objectives/Conquer";
import {DeclareWar as DeclareWar} from "../objectives/DeclareWar";
import {Discovery as Discovery} from "../objectives/Discovery";
import {ExpandManufactoryCapacity as ExpandManufactoryCapacity} from "../objectives/ExpandManufactoryCapacity";
import {Expansion as Expansion} from "../objectives/Expansion";
import {FightInvadingEnemy as FightInvadingEnemy} from "../objectives/FightInvadingEnemy";
import {Heal as Heal} from "../objectives/Heal";
import {ScoutingPerimeter as ScoutingPerimeter} from "../objectives/ScoutingPerimeter";

import {ObjectiveCreatorTemplate} from "../objectives/common/ObjectiveCreatorTemplate";


export const objectiveCreatorTemplates: ObjectiveCreatorTemplate[] =
[
  BuildUnitsForFront.makeCreatorTemplate(),
  CleanUpPirates.makeCreatorTemplate(),
  Conquer.makeCreatorTemplate(),
  DeclareWar.makeCreatorTemplate(),
  Discovery.makeCreatorTemplate(),
  ExpandManufactoryCapacity.makeCreatorTemplate(),
  Expansion.makeCreatorTemplate(),
  FightInvadingEnemy.makeCreatorTemplate(),
  Heal.makeCreatorTemplate(),
  ScoutingPerimeter.makeCreatorTemplate(),
];
