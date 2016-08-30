import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import ObjectiveTemplate from "./objectives/common/ObjectiveTemplate";

import declareWar from  "./objectives/declareWar";
import expansion from  "./objectives/expansion";
import cleanUpPirates from  "./objectives/cleanUpPirates";
import discovery from  "./objectives/discovery";
import heal from  "./objectives/heal";
import conquer from  "./objectives/conquer";
import expandManufactoryCapacity from  "./objectives/expandManufactoryCapacity";
import scoutingPerimeter from  "./objectives/scoutingPerimeter";
import fightInvadingEnemy from "./objectives/fightInvadingEnemy";

const Objectives: TemplateCollection<ObjectiveTemplate> =
{
  [declareWar.key]: declareWar,
  [expansion.key]: expansion,
  [cleanUpPirates.key]: cleanUpPirates,
  [discovery.key]: discovery,
  [heal.key]: heal,
  [conquer.key]: conquer,
  [expandManufactoryCapacity.key]: expandManufactoryCapacity,
  [scoutingPerimeter.key]: scoutingPerimeter,
  [fightInvadingEnemy.key]: fightInvadingEnemy
}

export default Objectives;
