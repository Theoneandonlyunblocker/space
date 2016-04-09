import TechnologyRequirement from "./TechnologyRequirement.d.ts";

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
