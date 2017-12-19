import TutorialVisibility from "./TutorialVisibility";


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
    localStorage.setItem("Rance.TutorialStatus", JSON.stringify(this.serialize()));
  }
  public load(): void
  {
    this.setDefaultValues();

    const tutorialStatusData = localStorage.getItem("Rance.TutorialStatus");

    if (!tutorialStatusData)
    {
      return;
    }

    const parsedData: TutorialStatusValues = JSON.parse(tutorialStatusData);
    this.deSerialize(parsedData);
  }
  public reset(): void
  {
    localStorage.removeItem("Rance.TutorialStatus");
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
  private deSerialize(data: TutorialStatusValues): void
  {
    this.introTutorial = TutorialStatus.getDeserializedState(data.introTutorial);

    this.setDefaultValuesForUndefined();
  }
}

const tutorialStatus = new TutorialStatus();
export default tutorialStatus;
