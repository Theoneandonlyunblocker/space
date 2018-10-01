enum BattleUIState
{
  // no control
  BattleStarting,
  // display hovered & active unit
  Idle,
  // display user & target unit | blinking border around target
  FocusingUnit,
  // display user & target unit | darken formations
  PlayingSfx,
  // animate turn counter | animate turn order | add annihilated overlay
  TransitioningTurn,
  // no control
  BattleEnding,
}

export default BattleUIState;
