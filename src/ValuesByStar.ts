import {IdDictionary} from "./IdDictionary";
import {Star} from "./Star";


export class ValuesByStar<T> extends IdDictionary<Star, T>
{
  constructor(stars?: Star[], getValueFN?: (star: Star) => T)
  {
    super(stars, getValueFN);
  }
}
