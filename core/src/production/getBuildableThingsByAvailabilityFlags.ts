import { TemplateCollection } from "../templateinterfaces/TemplateCollection";
import { AvailabilityData } from "../templateinterfaces/AvailabilityData";


export function getBuildableThingsByAvailabilityFlags<T extends {availabilityData: AvailabilityData}>(
  allTemplates: TemplateCollection<T>,
  filterFN: (flags: Set<string>) => boolean,
): T[]
{
  return allTemplates.filter(template =>
  {
    const flags = new Set(template.availabilityData.flags);

    return filterFN(flags);
  });
}
