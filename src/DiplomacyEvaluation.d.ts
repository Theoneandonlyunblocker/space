import DiplomacyState from "./DiplomacyState.ts";

declare interface DiplomacyEvaluation
{
  currentTurn: number;
  currentStatus: DiplomacyState;
  neighborStars: number;
  opinion: number;
}

export default DiplomacyEvaluation;
