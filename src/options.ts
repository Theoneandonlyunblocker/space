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
      // month goes 0-11
      var optionsToResetIfSetEarlierThan =
      {
        "battleAnimationTiming": Date.UTC(2016, 1, 25, 10, 50)
      };

      var dateOptionsWereSaved = Date.parse(parsedData.date);

      for (var key in parsedData.options)
      {
        if (Rance.Options[key] !== undefined)
        {
          if (optionsToResetIfSetEarlierThan[key] && dateOptionsWereSaved <= optionsToResetIfSetEarlierThan[key])
          {
            console.log("reset option " + key);
            continue;
          }
          else
          {
            Rance.Options[key] === extendObject(parsedData.options[key], Rance.Options[key], true);
          }
        }
      }
    }
  }
  
  export module defaultOptions
  {
    export var battleAnimationTiming =
    {
      before: 750,
      effectDuration: 1,
      after: 1500,
      unitEnter: 200,
      unitExit: 100
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
