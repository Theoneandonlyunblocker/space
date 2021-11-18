import {AttitudeModifierTemplate} from "core/src/templateinterfaces/AttitudeModifierTemplate";

import {DiplomacyEvaluation} from "core/src/diplomacy/DiplomacyEvaluation";
import {DiplomacyState} from "core/src/diplomacy/DiplomacyState";
import {localize} from "../localization/localize";


export const neighborStars: AttitudeModifierTemplate =
{
  key: "neighborStars",
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
  key: "atWar",
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
  key: "baseOpinion",
  get displayName()
  {
    return localize("baseOpinion_displayName").toString();
  },
  duration: Infinity,
};

export const declaredWar: AttitudeModifierTemplate =
{
  key: "declaredWar",
  get displayName()
  {
    return localize("declaredWar_displayName").toString();
  },
  duration: 15,

  baseEffect: -35,
  decayRate: 0.5,
};


export const attitudeModifierTemplates =
{
  [neighborStars.key]: neighborStars,
  [atWar.key]: atWar,
  [declaredWar.key]: declaredWar,
  [baseOpinion.key]: baseOpinion,
};
