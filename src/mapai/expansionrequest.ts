/// <reference path="request.ts"/>
/// <reference path="../star.ts"/>

/*
GS AI           |
  expansivity   |
                v

objectives ai
  desire to expand

 */

module Rance
{
  export interface IExpansionGoal extends IRequestGoal
  {
    score: number;
    target: Star;
  }
  export class ExpansionRequest extends Request
  {
    priority: number;
    goals: IExpansionGoal[];

    constructor(priority: number, goals: IExpansionGoal[])
    {
      super(priority, goals);
    }
  }
}
