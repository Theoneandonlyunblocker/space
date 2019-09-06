import {AttitudeModifierTemplate} from "core/templateinterfaces/AttitudeModifierTemplate";
import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";

import {DiplomacyEvaluation} from "core/diplomacy/DiplomacyEvaluation";
import {DiplomacyState} from "core/diplomacy/DiplomacyState";
import {localize} from "./localization/localize";


export const neighborStars: AttitudeModifierTemplate =
{
  type: "neighborStars",
  get displayName()
  {
    return localize("neighborStars_displayName").toString();
  },
  duration: Infinity,

  startCondition: (evaluation: DiplomacyEvaluation) =>
  {
    return (evaluation.neighborStars.length >= 2 && evaluation.opinion < 50);
  },

  getEffectFromEvaluation: (evaluation: DiplomacyEvaluation) =>
  {
    return -2 * evaluation.neighborStars.length;
  },
};

export const atWar: AttitudeModifierTemplate =
{
  type: "atWar",
  get displayName()
  {
    return localize("atWar_displayName").toString();
  },
  duration: Infinity,

  startCondition: (evaluation: DiplomacyEvaluation) =>
  {
    return (evaluation.currentStatus >= DiplomacyState.War);
  },

  baseEffect: -30,
};


export const baseOpinion: AttitudeModifierTemplate =
{
  type: "baseOpinion",
  get displayName()
  {
    return localize("baseOpinion_displayName").toString();
  },
  duration: Infinity,
};

export const declaredWar: AttitudeModifierTemplate =
{
  type: "declaredWar",
  get displayName()
  {
    return localize("declaredWar_displayName").toString();
  },
  duration: 15,

  baseEffect: -35,
  decayRate: 0.5,
};


export const attitudeModifierTemplates: TemplateCollection<AttitudeModifierTemplate> =
{
  [neighborStars.type]: neighborStars,
  [atWar.type]: atWar,
  [declaredWar.type]: declaredWar,
  [baseOpinion.type]: baseOpinion,
};
