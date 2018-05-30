import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import * as MapModes from "./mapmodetemplates/mapModes";


const mapModeTemplates: TemplateCollection<MapRendererMapModeTemplate> =
{
  [MapModes.defaultMapMode.key]: MapModes.defaultMapMode,
  [MapModes.noStatic.key]: MapModes.noStatic,
  [MapModes.income.key]: MapModes.income,
  [MapModes.resources.key]: MapModes.resources,
};

export default mapModeTemplates;
