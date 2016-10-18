import TemplateCollection from "./templateinterfaces/TemplateCollection";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate";

export function setAttitudeModifierOverride(attitudeModifiers: TemplateCollection<AttitudeModifierTemplate>)
{
  for (let modifierType in attitudeModifiers)
  {
    var modifier = attitudeModifiers[modifierType];
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
  for (let technologyKey in technologyTemplates)
  {
    const technology = technologyTemplates[technologyKey];
    for (let level in technology.unlocksPerLevel)
    {
      const unlockedTemplatesForLevel = technology.unlocksPerLevel[level];
      unlockedTemplatesForLevel.forEach(template =>
      {
        if (!template.technologyRequirements)
        {
          template.technologyRequirements = [];
        }
        template.technologyRequirements.push(
        {
          technology: technology,
          level: parseInt(level)
        });
      });
    }
  }
}
