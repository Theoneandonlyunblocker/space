import { getBuildableThingsByAvailabilityFlags } from "core/src/production/getBuildableThingsByAvailabilityFlags";
import { AvailabilityData, coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";


export function getHumanLikeBuildableThings<T extends {availabilityData: AvailabilityData}>(templates: TemplateCollection<T>): T[]
{
  return getBuildableThingsByAvailabilityFlags(templates, flags =>
  {
    return flags.has(commonAvailabilityFlags.humanLike) || flags.has(coreAvailabilityFlags.crucial);
  });
}
