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

    var parsedData: any;
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
      Rance.Options = extendObject(parsedData.options, Rance.Options, true);
    }
  }
  
  export module defaultOptions
  {
    export var battleAnimationTiming =
    {
      before: 1,
      effectDuration: 1,
      after: 1
    }
    export var debugMode = false;
    export var debugOptions =
    {
      battleSimulationDepth: 20
    };
    export var ui =
    {
      noHamburger: false
    };
    export var display =
    {
      borderWidth: 8
    };
  }

  export var Options: any;
}
