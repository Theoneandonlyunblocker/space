import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import TemplateCollection from "./templateinterfaces/TemplateCollection";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";
import UnitTemplate from "./templateinterfaces/UnitTemplate";
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
export function setUnitFamilyAssociatedTemplates(unitTemplates: TemplateCollection<UnitTemplate>)
{
  for (let unitType in unitTemplates)
  {
    var template = unitTemplates[unitType];
    for (let i = 0; i < template.families.length; i++)
    {
      var family = template.families[i];
      if (!family.associatedTemplates)
      {
        family.associatedTemplates = [];
      }

      family.associatedTemplates.push(template);
    }
  }
}
