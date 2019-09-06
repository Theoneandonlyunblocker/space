import {RaceTemplate} from "core/templateinterfaces/RaceTemplate";
import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";

import {federationAlliance} from "./templates/federationAlliance";
import {wormThings} from "./templates/wormThings";


export const raceTemplates: TemplateCollection<RaceTemplate> =
{
  [federationAlliance.type]: federationAlliance,
  [wormThings.type]: wormThings,
};
