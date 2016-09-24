import TutorialState from "./TutorialState";

interface TutorialStatusValues
{
  introTutorial: TutorialState;
}

const defaultTutorialStatus =
{
  introTutorial: TutorialState.show
}

class TutorialStatus implements TutorialStatusValues
{
  introTutorial: TutorialState;
  
  constructor()
  {
    this.setDefaultValues();
  }
  private setDefaultValues()
  {
    this.introTutorial = defaultTutorialStatus.introTutorial;
  }
  private setDefaultValuesForUndefined()
  {
    this.introTutorial = isFinite(this.introTutorial) ? this.introTutorial : defaultTutorialStatus.introTutorial;
  }
  public save()
  {
    localStorage.setItem("Rance.TutorialStatus", JSON.stringify(this.serialize()));
  }
  public load()
  {
    this.setDefaultValues();
    
    if (!localStorage["Rance.TutorialStatus"])
    {
      return;
    }
    
    var parsedData: TutorialStatusValues = JSON.parse(localStorage.getItem("Rance.TutorialStatus"));
    this.deSerialize(parsedData);
  }
  public reset()
  {
    localStorage.removeItem("Rance.TutorialStatus");
    this.setDefaultValues();
  }
  
  private serialize(): TutorialStatusValues
  {
    return(
    {
      introTutorial: this.introTutorial
    });
  }
  private static getDeSerializedState(state: TutorialState)
  {
    return state === TutorialState.dontShowThisSession ? TutorialState.show : state;
  }
  private deSerialize(data: TutorialStatusValues)
  {
    this.introTutorial = TutorialStatus.getDeSerializedState(data.introTutorial);
    
    this.setDefaultValuesForUndefined();
  }
}

const tutorialStatus = new TutorialStatus();
export default tutorialStatus;
