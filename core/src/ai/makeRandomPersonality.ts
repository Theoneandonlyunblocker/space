import { Personality } from "./Personality";
import { ArchetypeValues } from "./ArchetypeValues";
import { activeModuleData } from "../app/activeModuleData";


export function makeRandomPersonality(): Personality
{
  const unitCompositionPreference: ArchetypeValues = {};

  for (const archetype in activeModuleData.templates.unitArchetypes)
  {
    unitCompositionPreference[archetype] = Math.random();
  }

  return(
  {
    expansiveness: Math.random(),
    aggressiveness: Math.random(),
    friendliness: Math.random(),

    unitCompositionPreference: unitCompositionPreference,
  });
}
