import {DiplomacyState} from "src/diplomacy/DiplomacyState";

export const diplomacy =
{
  opinion: "Opinion",
  diplomaticStatus: "Status",
  makePeace: "Make peace",
  declareWar: "Declare war",
  endsOn: "Ends on",
  attitudeModifierEffect: "Effect",
  aiPersonality: "AI Personality",

  diplomacyState: `{
    diplomacyState, select,
      ${DiplomacyState.Unmet}   {Unmet}
      ${DiplomacyState.Peace}   {Peace}
      ${DiplomacyState.ColdWar} {Cold war}
      ${DiplomacyState.War}     {War}
      other {INVALID_VALUE diplomacyState {diplomacyState}}
  }`,
  diplomacyStateDescription: `{
    diplomacyState, select,
      ${DiplomacyState.Unmet}   {You haven't met this player yet}
      ${DiplomacyState.Peace}   {Players are at peace and can't engage in combat}
      ${DiplomacyState.ColdWar} {Players can engage in combat on neutral ground, but not fight over territory}
      ${DiplomacyState.War}     {Players can engage in combat freely and can conquer each other's territory}
      other {INVALID_VALUE diplomacyState {diplomacyState}}
  }`,
};
