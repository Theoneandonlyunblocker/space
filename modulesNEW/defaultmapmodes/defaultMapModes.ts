import MapLayerTemplates from "./MapLayerTemplates.ts";
import MapModeTemplates from "./MapModeTemplates.ts";

import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate.d.ts";
import MapRendererMapModeTemplate from "../../src/templateinterfaces/MapRendererMapModeTemplate.d.ts";

const defaultMapModes: ModuleFile =
{
  key: "defaultMapModes",
  metaData:
  {
    name: "Default map modes",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<MapRendererLayerTemplate>(MapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates<MapRendererMapModeTemplate>(MapModeTemplates, "MapRendererMapModes");
    
    return moduleData;
  }
}

export default defaultMapModes;