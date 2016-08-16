import RaceTemplate from "../../src/templateinterfaces/RaceTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import federationAlliance from "./templates/federationAlliance";
import wormThings from "./templates/wormThings";

const RaceTemplates: TemplateCollection<RaceTemplate> =
{
  [federationAlliance.key]: federationAlliance,
  [wormThings.key]: wormThings,
}

export default RaceTemplates;