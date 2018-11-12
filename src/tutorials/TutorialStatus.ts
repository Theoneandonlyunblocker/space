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
    localStorage.setItem(storageStrings.tutorialStatus, JSON.stringify(this.serialize()));
  }
  public load(): void
  {
    this.setDefaultValues();

    const tutorialStatusData = localStorage.getItem(storageStrings.tutorialStatus);

    if (!tutorialStatusData)
    {
      return;
    }

    const parsedData: TutorialStatusValues = JSON.parse(tutorialStatusData);
    this.deserialize(parsedData);
  }
  public reset(): void
  {
    localStorage.removeItem(storageStrings.tutorialStatus);
    this.setDefaultValues();
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
