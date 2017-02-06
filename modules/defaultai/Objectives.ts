import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import ObjectiveTemplate from "./objectives/common/ObjectiveTemplate";

import cleanUpPirates from  "./objectives/cleanUpPirates";
import conquer from  "./objectives/conquer";
import declareWar from  "./objectives/declareWar";
import discovery from  "./objectives/discovery";
import expandManufactoryCapacity from  "./objectives/expandManufactoryCapacity";
import expansion from  "./objectives/expansion";
import fightInvadingEnemy from "./objectives/fightInvadingEnemy";
import heal from  "./objectives/heal";
import scoutingPerimeter from  "./objectives/scoutingPerimeter";

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
  [fightInvadingEnemy.key]: fightInvadingEnemy,
};

export default Objectives;
