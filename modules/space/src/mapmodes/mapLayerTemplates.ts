import {nonFillerStars} from  "./maplayertemplates/nonFillerStars";
import {starLinks} from  "./maplayertemplates/starLinks";
import {fleets} from  "./maplayertemplates/fleets";
import {nonFillerVoronoiLines} from  "./maplayertemplates/nonFillerVoronoiLines";
import {resources} from  "./maplayertemplates/resources";
import {starOwners} from  "./maplayertemplates/starOwners";
import {fogOfWar} from  "./maplayertemplates/fogOfWar";
import {ownerBorders} from  "./maplayertemplates/ownerBorders";
import {starIncome} from  "./maplayertemplates/starIncome";
import {terrain} from  "./maplayertemplates/terrain";


export const mapLayerTemplates =
{
  [nonFillerStars.key]: nonFillerStars,
  [starLinks.key]: starLinks,
  [fleets.key]: fleets,
  [nonFillerVoronoiLines.key]: nonFillerVoronoiLines,
  [resources.key]: resources,
  [starOwners.key]: starOwners,
  [fogOfWar.key]: fogOfWar,
  [ownerBorders.key]: ownerBorders,
  [starIncome.key]: starIncome,
  [terrain.key]: terrain,
};
