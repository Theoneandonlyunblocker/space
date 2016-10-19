// TODO 19.10.2016 | remove this
declare interface NameTemplate
{
  ranceKey: string;
  displayName: string;
  chainsTo?:
  {
    ranceKey: string; // up to name generator function to decide how to interpret this
    weight: number;
  }[];
}

export default NameTemplate;
