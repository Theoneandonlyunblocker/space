
import ObjectiveTemplate from "../objectives/common/ObjectiveTemplate";

import MapEvaluator from "./MapEvaluator";

import idGenerators from "../../../src/idGenerators";
import Star from "../../../src/Star";
import Player from "../../../src/Player";

/*
objectives:
  defend area
  attack player at area
  expand

  clean up pirates
  heal

  ~~building
 */

export default class Objective
{
  id: number;
  template: ObjectiveTemplate;
  type: string;
  private _basePriority: number;
  get priority(): number
  {
    return this.isOngoing ? this._basePriority * 1.25 : this._basePriority;
  }
  set priority(priority: number)
  {
    this._basePriority = priority;
  }
  isOngoing: boolean = false; // used to slightly prioritize old objectives

  target: Star;
  targetPlayer: Player;

  constructor(template: ObjectiveTemplate,priority: number, target: Star,
    targetPlayer?: Player)
  {
    this.id = idGenerators.objective++;

    this.template = template;
    this.type = this.template.key;
    this.priority = priority;
    this.target = target;
    this.targetPlayer = targetPlayer;
  }
  getUnitsDesired(mapEvaluator: MapEvaluator)
  {
    return this.template.unitsToFillObjectiveFN(mapEvaluator, this);
  }
}
