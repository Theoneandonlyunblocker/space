/// <reference path="../src/utility.ts" />

module Rance
{
  export function saveOptions(slot: number = 0)
  {
    var data = JSON.stringify(
    {
      options: Rance.Options,
      date: new Date()
    });

    var saveName = "Rance.Options." + slot;

    localStorage.setItem(saveName, data);
  }
  export function loadOptions(slot?: number)
  {
    var baseString = "Rance.Options.";

    var parsedOptions;
    if (slot && localStorage[baseString + slot])
    {
      parsedOptions = JSON.parse(localStorage.getItem(baseString + slot));
    }
    else
    {
      parsedOptions = getMatchingLocalstorageItemsByDate(baseString)[0];
    }
    
    

    mergeObjects(Rance.Options, parsedOptions);
  }
  export module Options
  {
    export var battleAnimationTiming =
    {
      before: 250,
      effectDuration: 1500,
      after: 250
    }
  }
}
