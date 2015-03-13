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

    var parsedData;
    if (slot && localStorage[baseString + slot])
    {
      parsedData = JSON.parse(localStorage.getItem(baseString + slot));
    }
    else
    {
      parsedData = getMatchingLocalstorageItemsByDate(baseString)[0];
    }
    
    if (parsedData)
    {
      Options = extendObject(parsedData.options, Rance.Options);
    }
  }
  
  export module defaultOptions
  {
    export var battleAnimationTiming =
    {
      before: 250,
      effectDuration: 1500,
      after: 250
    }
  }

  export var Options: any;
}
