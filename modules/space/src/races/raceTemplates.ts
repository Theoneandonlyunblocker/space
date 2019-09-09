import {RaceTemplate} from "core/src/templateinterfaces/RaceTemplate";
import {TemplateCollection} from "core/src/templateinterfaces/TemplateCollection";

import {federationAlliance} from "./templates/federationAlliance";
import {wormThings} from "./templates/wormThings";


export const raceTemplates: TemplateCollection<RaceTemplate> =
{
  [federationAlliance.type]: federationAlliance,
  [wormThings.type]: wormThings,
};
