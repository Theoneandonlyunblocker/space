declare interface BuildingEffect
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

export default BuildingEffect;
