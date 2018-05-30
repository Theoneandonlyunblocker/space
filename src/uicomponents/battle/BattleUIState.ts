enum BattleUIState
{
  // no control
  Starting,
  // hovered & active unit
  Idle,
  // user & target unit | blinking border around target
  FocusingUnit,
  // user & target unit | darken formations
  PlayingSfx,
  // animate turn counter | animate turn order | add annihilated overlay
  TransitioningTurn,
  // no control
  Ending,
}

export default BattleUIState;
