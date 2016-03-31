/// <reference path="../src/utility.ts" />
/// <reference path="../src/unit.ts" />

namespace Rance
{
  export function setAllDynamicTemplateProperties()
  {
    setAbilityGuardAddition();
    setAttitudeModifierOverride();
    setUnitFamilyAssociatedTemplates();
  }
  function setAbilityGuardAddition()
  {
    function checkIfAbilityAddsGuard(ability: Templates.IAbilityTemplate)
    {
      var effects = [ability.mainEffect];
      if (ability.secondaryEffects)
      {
        effects = effects.concat(ability.secondaryEffects);
      }

      var dummyUser = new Unit(getRandomProperty(app.moduleData.Templates.Units));
      var dummyTarget = new Unit(getRandomProperty(app.moduleData.Templates.Units));

      for (var i = 0; i < effects.length; i++)
      {
        effects[i].action.executeAction(dummyUser, dummyTarget, null, effects[i].data);
        if (dummyUser.battleStats.guardAmount)
        {
          return true;
        }
      }

      return false;
    }

    for (var abilityName in app.moduleData.Templates.Abilities)
    {
      var ability = <Templates.IAbilityTemplate> app.moduleData.Templates.Abilities[abilityName];
      ability.addsGuard = checkIfAbilityAddsGuard(ability);
    }
  }
  function setAttitudeModifierOverride()
  {
    for (var modifierType in app.moduleData.Templates.AttitudeModifiers)
    {
      var modifier = app.moduleData.Templates.AttitudeModifiers[modifierType];
      if (modifier.canBeOverriddenBy)
      {
        for (var i = 0; i < modifier.canBeOverriddenBy.length; i++)
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
  function setUnitFamilyAssociatedTemplates()
  {
    for (var unitType in app.moduleData.Templates.Units)
    {
      var template = app.moduleData.Templates.Units[unitType];
      for (var i = 0; i < template.families.length; i++)
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
}
