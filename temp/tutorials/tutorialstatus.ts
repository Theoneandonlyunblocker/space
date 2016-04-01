namespace Rance
{
  export enum tutorialStatus
  {
    neverShow = -1,
    dontShowThisSession = 0,
    show = 1
  }

  export function saveTutorialState()
  {
    localStorage.setItem("Rance.TutorialState", JSON.stringify(Rance.TutorialState));
  }

  export function loadTutorialState()
  {
    if (localStorage["Rance.TutorialState"])
    {
      var parsedData = JSON.parse(localStorage.getItem("Rance.TutorialState"));
      Rance.TutorialState = extendObject(parsedData, Rance.TutorialState, true);
      for (var tutorialId in Rance.TutorialState)
      {
        if (Rance.TutorialState[tutorialId] === tutorialStatus.dontShowThisSession)
        {
          Rance.TutorialState[tutorialId] = Rance.tutorialStatus.show;
        }
      }
    }
  }

  export function resetTutorialState()
  {
    localStorage.removeItem("Rance.TutorialState");
    Rance.TutorialState = extendObject(defaultTutorialState);
  }

  export var defaultTutorialState =
  {
    introTutorial: tutorialStatus.show
  }

  export var TutorialState: any;
}
