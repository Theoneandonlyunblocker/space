import Unit from "./Unit";

declare interface TurnOrderDisplayData
{
  moveDelay: number;

  isGhost: boolean;
  unit: Unit;
  displayName: string;
}

export default TurnOrderDisplayData;