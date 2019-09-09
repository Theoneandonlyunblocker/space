import {MapGenTemplate} from "core/src/templateinterfaces/MapGenTemplate";
import {TemplateCollection} from "core/src/templateinterfaces/TemplateCollection";

import {spiralGalaxy} from "./templates/spiralGalaxy";
import {tinierSpiralGalaxy} from "./templates/tinierSpiralGalaxy";


export const mapGenTemplates: TemplateCollection<MapGenTemplate> =
{
  [spiralGalaxy.key]: spiralGalaxy,
  [tinierSpiralGalaxy.key]: tinierSpiralGalaxy,
};
