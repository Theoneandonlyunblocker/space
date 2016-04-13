import Distributable from "./Distributable";

declare interface ResourceTemplate extends Distributable
{
  type: string;
  displayName: string;
  icon: string;
}

export default ResourceTemplate;
