import
{
  extendObject
} from "../utility";

export enum TutorialState
{
  neverShow = -1,
  dontShowThisSession = 0,
  show = 1
}

export function saveTutorialStatus()
{
  localStorage.setItem("TutorialStatus", JSON.stringify(TutorialStatus));
}

export function loadTutorialStatus()
{
  if (localStorage["TutorialStatus"])
  {
    var parsedData = JSON.parse(localStorage.getItem("TutorialStatus"));
    TutorialStatus = extendObject(parsedData, TutorialStatus, true);
    for (var tutorialId in TutorialStatus)
    {
      if (TutorialStatus[tutorialId] === TutorialState.dontShowThisSession)
      {
        TutorialStatus[tutorialId] = TutorialState.show;
      }
    }
  }
}

export function resetTutorialStatus()
{
  localStorage.removeItem("TutorialStatus");
  TutorialStatus = extendObject(defaultTutorialStatus);
}

interface TutorialStatus
{
  introTutorial: TutorialState;
}

export const defaultTutorialStatus: TutorialStatus =
{
  introTutorial: TutorialState.show
}

export let TutorialStatus: TutorialStatus = extendObject(defaultTutorialStatus);
