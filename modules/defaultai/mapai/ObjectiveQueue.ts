import {Objective} from "../objectives/common/Objective";

export class ObjectiveQueue
{
  private objectivesToExecute: Objective[] = [];
  private currentObjective: Objective;
  private onAllFinished: () => void;
  private executionFailureTimeoutHandle: number;

  constructor()
  {

  }

  public static sortByFinalPriority(a: Objective, b: Objective): number
  {
    return b.finalPriority - a.finalPriority;
  }

  public executeObjectives(
    objectivesToExecute: Objective[],
    onAllFinished: () => void,
  ): void
  {
    this.objectivesToExecute = objectivesToExecute;
    this.onAllFinished = onAllFinished;

    this.executeNextObjective();
  }
  private executeNextObjective(): void
  {
    this.currentObjective = this.objectivesToExecute.shift();

    console.log("execute", this.currentObjective);
    this.clearExecutionFailureTimeout();

    if (!this.currentObjective)
    {
      this.onAllFinished();

      return;
    }

    this.setExecutionFailureTimeout();

    this.currentObjective.execute(
      this.executeNextObjective.bind(this),
    );
  }
  private setExecutionFailureTimeout(delay: number = 5000): void
  {
    this.executionFailureTimeoutHandle = window.setTimeout(() =>
    {
      console.warn(`Objective of type ${this.currentObjective.type} failed to trigger finish callback for objective execution after ${delay}ms`);
      this.clearExecutionFailureTimeout();
    }, delay);
  }
  private clearExecutionFailureTimeout(): void
  {
    window.clearTimeout(this.executionFailureTimeoutHandle);
    this.executionFailureTimeoutHandle = null;
  }
}
