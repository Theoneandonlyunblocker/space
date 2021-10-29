import { AvailabilityData, coreAvailabilityFlags } from "../templateinterfaces/AvailabilityData";
import { TemplateCollection } from "../generic/TemplateCollection";
import { RaceTemplate } from "../templateinterfaces/RaceTemplate";
import { getBuildableThingsByAvailabilityFlags } from "./getBuildableThingsByAvailabilityFlags";


export function getDefaultBuildableNonCoreThingsForRace<T extends {availabilityData: AvailabilityData}>(
  allTemplates: TemplateCollection<T>,
  race: RaceTemplate,
)
{
  const associatedFlags =
  [
    coreAvailabilityFlags.crucial,
    ...race.associatedAvailabilityFlags,
  ];

  return getBuildableThingsByAvailabilityFlags(
    allTemplates,
    (flags) => associatedFlags.some(associatedFlag => flags.has(associatedFlag)),
  );
}
