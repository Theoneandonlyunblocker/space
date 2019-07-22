export enum BattleUIState
{
  // no control
  BattleStarting,
  // display hovered & active unit
  Idle,
  // display user & target unit | blinking border around target
  FocusingUnit,
  // display user & target unit | darken formations
  PlayingVfx,
  // animate turn counter | animate turn order | add annihilated overlay
  TransitioningTurn,
  // no control
  BattleEnding,
}
