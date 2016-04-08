import SubEmblemTemplates from "./SubEmblemTemplates.ts";

import app from "../../src/App.ts";
import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import SubEmblemTemplate from "../../src/templateinterfaces/SubEmblemTemplate.d.ts";

const defaultBuildings: ModuleFile =
{
  key: "defaultBuildings",
  metaData:
  {
    name: "Default Buildings",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  loadAssets: function(onLoaded: () => void)
  {
    const loader = new PIXI.loaders.Loader();
    
    for (let templateKey in SubEmblemTemplates)
    {
      const template = SubEmblemTemplates[templateKey];
      loader.add(
      {
        url: template.src,
        loadType: 2, // image
        xhrType: "png"
      });
    }
    
    loader.load(function(loader: PIXI.loaders.Loader)
    {
      for (let templateKey in SubEmblemTemplates)
      {
        const template = SubEmblemTemplates[templateKey];
        const image = loader.resources[template.src].data;
        app.images[template.src] = image;

        // IE fix
        if (!image.width)
        {
          document.body.appendChild(image);
          image.width = image.offsetWidth;
          image.height = image.offsetHeight;
          document.body.removeChild(image);
        }
      }
      
      onLoaded();
    });
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<SubEmblemTemplate>(SubEmblemTemplates, "SubEmblems");
    
    return moduleData;
  }
}

export default defaultBuildings;
