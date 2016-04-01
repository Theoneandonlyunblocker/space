declare interface IManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  buildCost: number;

  technologyRequirements?: TechnologyRequirement[];
}
