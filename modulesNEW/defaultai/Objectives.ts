import ObjectiveTemplate from "../../src/templateinterfaces/ObjectiveTemplate.d.ts";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection.d.ts";

import declareWar from  "./objectives/declareWar.ts";
import expansion from  "./objectives/expansion.ts";
import cleanUpPirates from  "./objectives/cleanUpPirates.ts";
import discovery from  "./objectives/discovery.ts";
import heal from  "./objectives/heal.ts";
import conquer from  "./objectives/conquer.ts";
import expandManufactoryCapacity from  "./objectives/expandManufactoryCapacity.ts";
import scoutingPerimeter from  "./objectives/scoutingPerimeter.ts";

const Objectives: TemplateCollection<ObjectiveTemplate> =
{
  [declareWar.key]: declareWar,
  [expansion.key]: expansion,
  [cleanUpPirates.key]: cleanUpPirates,
  [discovery.key]: discovery,
  [heal.key]: heal,
  [conquer.key]: conquer,
  [expandManufactoryCapacity.key]: expandManufactoryCapacity,
  [scoutingPerimeter.key]: scoutingPerimeter
}

export default Objectives;
