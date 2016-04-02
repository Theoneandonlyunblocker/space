namespace Rance
{
  export function makeRandomPersonality(): IPersonality
  {
    var unitCompositionPreference: ArchetypeValues = {};

    for (var archetype in app.moduleData.Templates.UnitArchetypes)
    {
      unitCompositionPreference[archetype] = Math.random();
    }

    return(
    {
      expansiveness: Math.random(),
      aggressiveness: Math.random(),
      friendliness: Math.random(),

      unitCompositionPreference: unitCompositionPreference
    });
  }
}