import {DiplomacyState} from "./DiplomacyState";
import {Star} from "../map/Star";

export interface DiplomacyEvaluation
{
  currentTurn: number;
  currentStatus: DiplomacyState;
  neighborStars: Star[];
  opinion: number;
}
