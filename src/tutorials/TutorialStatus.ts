import * as localForage from "localforage";

import {TutorialVisibility} from "./TutorialVisibility";
import * as debug from "../debug";
import { storageStrings } from "../storageStrings";


interface TutorialStatusValues
{
  introTutorial: TutorialVisibility;
}

const defaultTutorialStatus: TutorialStatusValues =
{
  introTutorial: TutorialVisibility.Show,
};

class TutorialStatus implements TutorialStatusValues
{
  public introTutorial: TutorialVisibility;

  constructor()
  {
    this.setDefaultValues();
  }

  private static getDeserializedState(state: TutorialVisibility): TutorialVisibility
  {
    return state === TutorialVisibility.DontShowThisSession ? TutorialVisibility.Show : state;
  }

  public save(): void
  {
    localForage.setItem(storageStrings.tutorialStatus, JSON.stringify(this.serialize()));
  }
  public load(): Promise<void>
  {
    debug.log("init", "Start loading tutorial status");
    this.setDefaultValues();

    return localForage.getItem<string>(storageStrings.tutorialStatus).then(tutorialStatusData =>
    {
      if (tutorialStatusData)
      {
        const parsedData: TutorialStatusValues = JSON.parse(tutorialStatusData);
        this.deserialize(parsedData);
      }

      debug.log("init", "Finish loading tutorial status");
    });
  }
  public reset(): Promise<void>
  {
    return localForage.removeItem(storageStrings.tutorialStatus).then(() =>
    {
      this.setDefaultValues();
    });
  }

  private setDefaultValues(): void
  {
    this.introTutorial = defaultTutorialStatus.introTutorial;
  }
  private setDefaultValuesForUndefined(): void
  {
    this.introTutorial = isFinite(this.introTutorial) ? this.introTutorial : defaultTutorialStatus.introTutorial;
  }
  private serialize(): TutorialStatusValues
  {
    return(
    {
      introTutorial: this.introTutorial,
    });
  }
  private deserialize(data: TutorialStatusValues): void
  {
    this.introTutorial = TutorialStatus.getDeserializedState(data.introTutorial);

    this.setDefaultValuesForUndefined();
  }
}

export const tutorialStatus = new TutorialStatus();
