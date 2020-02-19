export const combatEffectFlags =
{
  // increases considered positive, decreases considered negative
  // slay the spire example: 'strength' (deal more damage)
  positive: "positive",

  // f. ex. 'gainStrengthAtEndOfTurn' added by 'temporarily lose X strength this turn'
  // however, not when positive and negative effect are added together but unlinked
  // '+strength, loseDefenceAtEndOfTurn' should have separate and respective tags
  //
  // increases are considered negative so that "block debuff" will block whole debuff and not just negative component
  // increases considered negative, decreases considered negative
  // slay the spire example: 'shackled' (gain strength at end of turn)
  positiveLinkedToNegative: "linkedToNegative",

  // increases considered negative, decreases considered positive
  // slay the spire example: 'poison' (take damage at end of turn)
  negative: "negative",

  // increases considered negative, decreases considered positive
  // slay the spire example: 'flex' (lose strength at end of turn)
  negativeLinkedToPositive: "linkedToPositive",
};
