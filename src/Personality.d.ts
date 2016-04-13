import ArchetypeValues from "./ArchetypeValues";

export interface Personality
{
  expansiveness: number;
  aggressiveness: number;
  friendliness: number;

  unitCompositionPreference: ArchetypeValues;
}

export default Personality;
