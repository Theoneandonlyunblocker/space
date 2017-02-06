import TechnologyRequirement from "./TechnologyRequirement";

declare interface ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  buildCost: number;

  // set dynamically
  technologyRequirements?: TechnologyRequirement[];
}

export default ManufacturableThing;
