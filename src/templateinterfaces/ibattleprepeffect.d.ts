declare namespace Rance
{
  namespace Templates
  {
    interface IBattlePrepEffect
    {
      (unit: Unit, battlePrep: BattlePrep): void;
    }
  }
}
