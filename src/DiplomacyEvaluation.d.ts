import DiplomacyState from "./DiplomacyState";
import {default as Star} from "./Star";

declare interface DiplomacyEvaluation
{
  currentTurn: number;
  currentStatus: DiplomacyState;
  neighborStars: Star[];
  opinion: number;
}

export default DiplomacyEvaluation;
