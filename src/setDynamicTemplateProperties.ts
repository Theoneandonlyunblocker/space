import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate";
import TemplateCollection from "./templateinterfaces/TemplateCollection";


export function setAttitudeModifierOverride(attitudeModifiers: TemplateCollection<AttitudeModifierTemplate>)
{
  for (const modifierType in attitudeModifiers)
  {
    const modifier = attitudeModifiers[modifierType];
    if (modifier.canBeOverriddenBy)
    {
      for (let i = 0; i < modifier.canBeOverriddenBy.length; i++)
      {
        if (!modifier.canBeOverriddenBy[i].canOverride)
        {
          modifier.canBeOverriddenBy[i].canOverride = [];
        }

        modifier.canBeOverriddenBy[i].canOverride.push(modifier);
      }
    }
  }
}
export function setTechnologyRequirements(technologyTemplates: TemplateCollection<TechnologyTemplate>)
{
  for (const technologyKey in technologyTemplates)
  {
    const technology = technologyTemplates[technologyKey];
    for (const level in technology.unlocksPerLevel)
    {
      const unlockedTemplatesForLevel = technology.unlocksPerLevel[level];
      unlockedTemplatesForLevel.forEach(template =>
      {
        if (!template.techRequirements)
        {
          template.techRequirements = [];
        }
        template.techRequirements.push(
        {
          technology: technology,
          level: parseInt(level),
        });
      });
    }
  }
}
