import MapRendererLayerTemplate from "../../src/templateinterfaces/MapRendererLayerTemplate.d.ts";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection.d.ts";

import debugSectors from  "./maplayertemplates/debugSectors.ts";
import nonFillerStars from  "./maplayertemplates/nonFillerStars.ts";
import playerInfluence from  "./maplayertemplates/playerInfluence.ts";
import starLinks from  "./maplayertemplates/starLinks.ts";
import fleets from  "./maplayertemplates/fleets.ts";
import nonFillerVoronoiLines from  "./maplayertemplates/nonFillerVoronoiLines.ts";
import resources from  "./maplayertemplates/resources.ts";
import starOwners from  "./maplayertemplates/starOwners.ts";
import fogOfWar from  "./maplayertemplates/fogOfWar.ts";
import ownerBorders from  "./maplayertemplates/ownerBorders.ts";
import starIncome from  "./maplayertemplates/starIncome.ts";

const MapLayerTemplates: TemplateCollection<MapRendererLayerTemplate> =
{
  [debugSectors.key]: debugSectors,
  [nonFillerStars.key]: nonFillerStars,
  [playerInfluence.key]: playerInfluence,
  [starLinks.key]: starLinks,
  [fleets.key]: fleets,
  [nonFillerVoronoiLines.key]: nonFillerVoronoiLines,
  [resources.key]: resources,
  [starOwners.key]: starOwners,
  [fogOfWar.key]: fogOfWar,
  [ownerBorders.key]: ownerBorders,
  [starIncome.key]: starIncome,
}

export default MapLayerTemplates;
