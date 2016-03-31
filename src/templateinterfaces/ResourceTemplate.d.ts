import Distributable from "./Distributable.d.ts";

declare interface ResourceTemplate extends Distributable
{
  type: string;
  displayName: string;
  icon: string;
}

export default ResourceTemplate;
