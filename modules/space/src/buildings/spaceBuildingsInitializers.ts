import * as PIXI from "pixi.js";

import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitialization";

import {buildingIconSources, buildingSvgCache} from "modules/space/assets/buildings/buildingAssets";


export const spaceBuildingsInitializers =
{
  [GameModuleInitializationPhase.MapGen]: (baseUrl: string) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    for (const key in buildingIconSources)
    {
      loader.add(
      {
        url: buildingIconSources[key],
        loadType: 1, // XML
      });
    }

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        for (const key in buildingIconSources)
        {
          const response = <XMLDocument> loader.resources[buildingIconSources[key]].data;
          const svgDoc = <SVGElement> response.children[0];
          buildingSvgCache[key] = svgDoc;
        }

        resolve();
      });
    });
  },
};
