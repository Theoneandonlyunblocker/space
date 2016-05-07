enum BattleUIState
{
  // hovered & active unit
  idle,
  // user & target unit | blinking border around target
  focusingUnit,
  // user & target unit | darken formations
  playingSFX,
  // animate turn counter | animate turn order | add annihilated overlay
  transitioningTurn,
}

export default BattleUIState;
