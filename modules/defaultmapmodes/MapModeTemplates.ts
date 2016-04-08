import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate.d.ts";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection.d.ts";

import * as MapModes from "./mapmodetemplates/mapModes.ts";

const MapModeTemplates: TemplateCollection<MapRendererMapModeTemplate> =
{
  [MapModes.defaultMapMode.key]: MapModes.defaultMapMode,
  [MapModes.noStatic.key]: MapModes.noStatic,
  [MapModes.income.key]: MapModes.income,
  [MapModes.influence.key]: MapModes.influence,
  [MapModes.resources.key]: MapModes.resources,
}

export default MapModeTemplates;
