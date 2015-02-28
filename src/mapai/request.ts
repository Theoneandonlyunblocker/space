module Rance
{
  export interface IRequestGoal
  {
    score: number;
  }
  export class Request
  {
    priority: number;
    goals: IRequestGoal[];

    constructor(priority: number, goals: IRequestGoal[])
    {
      this.priority = priority;
      this.goals = goals;
    }

    getGoalsByScore()
    {
      return this.goals.sort(function(a, b)
      {
        return b.score - a.score;
      });
    }
  }
}
