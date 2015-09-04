/// <reference path="../star.ts"/>

/*
objectives:
  defend area
  attack player at area
  expand

  clean up pirates
  heal

  ~~building
 */

module Rance
{
  export class Objective
  {
    id: number;
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

    constructor(type: string, priority: number, target: Star)
    {
      this.id = idGenerators.objective++;

      this.type = type;
      this.priority = priority;
      this.target = target;
    }
  }
}