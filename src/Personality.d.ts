import ArchetypeValues from "./ArchetypeValues.d.ts";

export interface Personality
{
  expansiveness: number;
  aggressiveness: number;
  friendliness: number;

  unitCompositionPreference: ArchetypeValues;
}

export default Personality;
