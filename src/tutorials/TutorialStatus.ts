import * as localForage from "localforage";

import TutorialVisibility from "./TutorialVisibility";
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
    this.setDefaultValues();

    return localForage.getItem<string>(storageStrings.tutorialStatus).then(tutorialStatusData =>
    {
      if (tutorialStatusData)
      {
        const parsedData: TutorialStatusValues = JSON.parse(tutorialStatusData);
        this.deserialize(parsedData);
      }
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

const tutorialStatus = new TutorialStatus();
export default tutorialStatus;
