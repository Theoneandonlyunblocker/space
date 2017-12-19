import AttitudeModifierTemplate from "../../src/templateinterfaces/AttitudeModifierTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import DiplomacyEvaluation from "../../src/DiplomacyEvaluation";
import DiplomacyState from "../../src/DiplomacyState";

const neighborStars: AttitudeModifierTemplate =
{
  type: "neighborStars",
  displayName: "neighborStars",
  duration: Infinity,

  startCondition: function(evaluation: DiplomacyEvaluation)
  {
    return (evaluation.neighborStars.length >= 2 && evaluation.opinion < 50);
  },

  getEffectFromEvaluation: function(evaluation: DiplomacyEvaluation)
  {
    return -2 * evaluation.neighborStars.length;
  },
};

const atWar: AttitudeModifierTemplate =
{
  type: "atWar",
  displayName: "At war",
  duration: Infinity,

  startCondition: function(evaluation: DiplomacyEvaluation)
  {
    return (evaluation.currentStatus >= DiplomacyState.War);
  },

  baseEffect: -30,
};

const declaredWar: AttitudeModifierTemplate =
{
  type: "declaredWar",
  displayName: "Declared war",
  duration: 15,
  triggers: ["addDeclaredWarAttitudeModifier"],

  baseEffect: -35,
  decayRate: 0.5,
};

const AttitudeModifierTemplates: TemplateCollection<AttitudeModifierTemplate> =
{
  [neighborStars.type]: neighborStars,
  [atWar.type]: atWar,
  [declaredWar.type]: declaredWar,
};

export default AttitudeModifierTemplates;
