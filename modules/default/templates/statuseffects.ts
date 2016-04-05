/// <reference path="../../../src/templateinterfaces/istatuseffectattributeadjustment.d.ts"/>
/// <reference path="../../../src/templateinterfaces/istatuseffectattributes.d.ts"/>
/// <reference path="../../../src/templateinterfaces/istatuseffecttemplate.d.ts"/>
export var test: StatusEffectTemplate =
{
  type: "test",
  displayName: "test",
  attributes:
  {
    attack:
    {
      flat: 9
    },
    defence:
    {
      flat: 9
    },
    speed:
    {
      flat: 9
    }
  },
  passiveSkills: [PassiveSkills.poisoned]
}
