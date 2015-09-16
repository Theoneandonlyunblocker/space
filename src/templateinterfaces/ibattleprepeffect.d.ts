declare module Rance
{
  module Templates
  {
    interface IBattlePrepEffect
    {
      (unit: Unit, battlePrep: BattlePrep): void;
    }
  }
}
