declare namespace Rance
{
  interface IManufacturableThing
  {
    type: string;
    displayName: string;
    description: string;
    buildCost: number;

    technologyRequirements?: Templates.ITechnologyRequirement[];
  }
}