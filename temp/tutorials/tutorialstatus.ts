export enum tutorialStatus
{
  neverShow = -1,
  dontShowThisSession = 0,
  show = 1
}

export function saveTutorialState()
{
  localStorage.setItem("TutorialState", JSON.stringify(TutorialState));
}

export function loadTutorialState()
{
  if (localStorage["TutorialState"])
  {
    var parsedData = JSON.parse(localStorage.getItem("TutorialState"));
    TutorialState = extendObject(parsedData, TutorialState, true);
    for (var tutorialId in TutorialState)
    {
      if (TutorialState[tutorialId] === tutorialStatus.dontShowThisSession)
      {
        TutorialState[tutorialId] = tutorialStatus.show;
      }
    }
  }
}

export function resetTutorialState()
{
  localStorage.removeItem("TutorialState");
  TutorialState = extendObject(defaultTutorialState);
}

export var defaultTutorialState =
{
  introTutorial: tutorialStatus.show
}

export var TutorialState: any;
