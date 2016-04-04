import
{
  getMatchingLocalstorageItemsByDate,
  deepMerge,
  extendObject
} from "./utility.ts";

interface Options
{
  battleAnimationTiming:
  {
    before: number;
    effectDuration: number;
    after: number;
    unitEnter: number;
    unitExit: number;
  }
  debugMode: boolean;
  debugOptions:
  {
    battleSimulationDepth: number;
  };
  ui:
  {
    noHamburger: boolean;
  };
  display:
  {
    borderWidth: number;
  };
}

export const defaultOptions: Options =
{
  battleAnimationTiming:
  {
    before: 750,
    effectDuration: 1,
    after: 1500,
    unitEnter: 200,
    unitExit: 100
  },
  debugMode: false,
  debugOptions:
  {
    battleSimulationDepth: 20
  },
  ui:
  {
    noHamburger: false
  },
  display:
  {
    borderWidth: 8
  }
}

export let Options: Options = extendObject(defaultOptions);

export function saveOptions(slot: number = 0)
{
  var data = JSON.stringify(
  {
    options: Options,
    date: new Date()
  });

  var saveName = "Options." + slot;

  localStorage.setItem(saveName, data);
}
export function loadOptions(slot?: number)
{
  var baseString = "Options.";

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

    for (var key in optionsToResetIfSetEarlierThan)
    {
      if (Options[key] !== undefined)
      {
        if (optionsToResetIfSetEarlierThan[key] && dateOptionsWereSaved <= optionsToResetIfSetEarlierThan[key])
        {
          parsedData.options[key] = extendObject(Options[key]);
          console.log("Reset option: " + key);
        }
      }
    }
    
    Options = deepMerge(Options, parsedData.options, true);
  }
}
