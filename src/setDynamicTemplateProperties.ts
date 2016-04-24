
import ModuleData from "./ModuleData";
import Unit from "./Unit";
import
{
  getRandomProperty
} from "./utility";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import ManufacturableThing from "./templateinterfaces/ManufacturableThing";

// TODO | add technology requirements
export default function setDynamicTemplateProperties(moduleData: ModuleData)
{
  setAbilityGuardAddition(moduleData);
  setAttitudeModifierOverride(moduleData);
  setUnitFamilyAssociatedTemplates(moduleData);
  setTechnologyRequirements(moduleData);
}
// TODO | use proper ability usage system
function setAbilityGuardAddition(moduleData: ModuleData)
{
  function checkIfAbilityAddsGuard(ability: AbilityTemplate)
  {
    var effects = [ability.mainEffect];
    if (ability.secondaryEffects)
    {
      effects = effects.concat(ability.secondaryEffects);
    }

    var dummyUser = new Unit(getRandomProperty(moduleData.Templates.Units));
    var dummyTarget = new Unit(getRandomProperty(moduleData.Templates.Units));

    for (let i = 0; i < effects.length; i++)
    {
      effects[i].action.executeAction(dummyUser, dummyTarget, null, effects[i].data);
      if (dummyUser.battleStats.guardAmount)
      {
        return true;
      }
    }

    return false;
  }

  for (let abilityName in moduleData.Templates.Abilities)
  {
    var ability = <AbilityTemplate> moduleData.Templates.Abilities[abilityName];
    ability.addsGuard = checkIfAbilityAddsGuard(ability);
  }
}
function setAttitudeModifierOverride(moduleData: ModuleData)
{
  for (let modifierType in moduleData.Templates.AttitudeModifiers)
  {
    var modifier = moduleData.Templates.AttitudeModifiers[modifierType];
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
function setUnitFamilyAssociatedTemplates(moduleData: ModuleData)
{
  for (let unitType in moduleData.Templates.Units)
  {
    var template = moduleData.Templates.Units[unitType];
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
function setTechnologyRequirements(moduleData: ModuleData)
{
  for (let technologyKey in moduleData.Templates.Technologies)
  {
    const technology = moduleData.Templates.Technologies[technologyKey];
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
