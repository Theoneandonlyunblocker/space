import { AvailabilityData, coreAvailabilityFlags } from "../templateinterfaces/AvailabilityData";
import { TemplateCollection } from "../templateinterfaces/TemplateCollection";
import { options } from "../app/Options";


export function getAlwaysAvailableBuildableThings<T extends {availabilityData: AvailabilityData}>(
  allTemplates: TemplateCollection<T>,
): T[]
{
  const validFlags = new Set([coreAvailabilityFlags.always]);
  if (options.debug.enabled)
  {
    validFlags.add(coreAvailabilityFlags.alwaysInDebugMode);
  }

  return allTemplates.filter(template =>
  {
    return template.availabilityData.flags.some(flag => validFlags.has(flag));
  });
}
