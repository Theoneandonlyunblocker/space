declare namespace Rance
{
  namespace Templates
  {
    interface INameTemplate
    {
      key: string;
      displayName: string;
      chainsTo?:
      {
        key: string; // up to name generator function to decide how to interpret this
        weight: number;
      }[];
    }
  }
}