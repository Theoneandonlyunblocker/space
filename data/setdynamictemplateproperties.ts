/// <reference path="../src/utility.ts" />
/// <reference path="../src/unit.ts" />

/// <reference path="templates/abilities.ts" />

module Rance
{
  export function setAllDynamicTemplateProperties()
  {
    setAbilityGuardAddition();
    setAttitudeModifierOverride();
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

      var dummyUser = new Unit(getRandomProperty(Templates.Units));
      var dummyTarget = new Unit(getRandomProperty(Templates.Units));

      for (var i = 0; i < effects.length; i++)
      {
        effects[i].template.effect(dummyUser, dummyTarget, effects[i].data);
        if (dummyUser.battleStats.guardAmount)
        {
          return true;
        }
      }

      return false;
    }

    for (var abilityName in Templates.Abilities)
    {
      var ability = <Templates.IAbilityTemplate> Templates.Abilities[abilityName];
      ability.addsGuard = checkIfAbilityAddsGuard(ability);
    }
  }
  function setAttitudeModifierOverride()
  {
    for (var modifierType in Templates.AttitudeModifiers)
    {
      var modifier = Templates.AttitudeModifiers[modifierType];
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
}
