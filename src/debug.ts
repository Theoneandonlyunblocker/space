module Rance
{
  export function toggleDebugMode()
  {
    Options.debugMode = !Options.debugMode;
    app.reactUI.render();
  }
  export function inspectSave(saveName: string)
  {
    var saveKey = "Rance.Save." + saveName;
    var save = localStorage.getItem(saveKey);

    return JSON.parse(save);
  }
}