import {Objective} from "../objectives/common/Objective";

export class ObjectiveQueue
{
  private objectivesToExecute: Objective[] = [];
  private objectivesExecutedSinceRecheck: number = 0;
  private recheckInterval: number = 20;

  private currentObjective: Objective;

  private getUpdatedObjectives: () => Objective[];
  private onAllFinished: () => void;

  constructor(getUpdatedObjectivesFN: () => Objective[])
  {
    this.getUpdatedObjectives = getUpdatedObjectivesFN;
  }

  public executeObjectives(onAllFinished: () => void): void
  {
    this.onAllFinished = onAllFinished;

    this.executeNextObjective();
  }
  public updateObjectives(): void
  {
    this.objectivesToExecute = this.getUpdatedObjectives().sort((a, b) =>
    {
      return b.finalPriority - a.finalPriority;
    });

    this.objectivesExecutedSinceRecheck = 0;
  }

  private executeNextObjective(): void
  {
    if (this.objectivesExecutedSinceRecheck >= this.recheckInterval)
    {
      this.updateObjectives();
    }

    this.currentObjective = this.objectivesToExecute.shift();

    if (!this.currentObjective)
    {
      this.onAllFinished();

      return;
    }

    this.objectivesExecutedSinceRecheck += 1;

    this.currentObjective.execute(
      this.executeNextObjective.bind(this),
      this.updateObjectives.bind(this),
    );
  }
}
