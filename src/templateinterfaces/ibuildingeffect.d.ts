declare namespace Rance
{
  namespace Templates
  {
    interface IBuildingEffect
    {
      vision?: number;
      detection?: number;
      income?:
      {
        flat?: number;
        multiplier?: number;
      }
      resourceIncome?:
      {
        flat?: number;
        multiplier?: number;
      }
      research?:
      {
        flat?: number;
        multiplier?: number;
      }
      itemLevel?: number;
    }
  }
}
