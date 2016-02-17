module Rance
{
  export enum tutorialStatus
  {
    dontShow = -1,
    show = 0
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
