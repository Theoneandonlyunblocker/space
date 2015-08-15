module Rance
{
  export function toggleDebugElements()
  {
    var debugElements = document.getElementsByClassName("debug");

    for (var i = 0; i < debugElements.length; i++)
    {
      var debugElement = <HTMLElement> debugElements[i];
      debugElement.classList.toggle("debug-hidden");
    }
  }
  export function inspectSave(saveName: string)
  {
    var saveKey = "Rance.Save." + saveName;
    var save = localStorage.getItem(saveKey);

    return JSON.parse(save);
  }
}