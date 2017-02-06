import eventManager from "./eventManager";
import
{
  deepMerge,
  getMatchingLocalstorageItemsByDate,
  shallowCopy
} from "./utility";

type OptionsCategory = "battleAnimationTiming" | "debug" | "ui" | "display";
const OptionsCategories: OptionsCategory[] =
[
  "battleAnimationTiming", "debug", "ui", "display"
];

interface OptionsValues
{
  battleAnimationTiming?:
  {
    before?: number;
    effectDuration?: number;
    after?: number;
    unitEnter?: number;
    unitExit?: number;
    turnTransition?: number;
  };
  debug?:
  {
    enabled?: boolean;
    battleSimulationDepth?: number;
  };
  ui?:
  {
    noHamburger?: boolean;
  };
  display?:
  {
    borderWidth?: number;
  };
}

const defaultOptionsValues =
{
  battleAnimationTiming:
  {
    before: 750,
    effectDuration: 1,
    after: 1500,
    unitEnter: 200,
    unitExit: 100,
    turnTransition: 1000
  },
  debug:
  {
    enabled: false,
    battleSimulationDepth: 20
  },
  ui:
  {
    noHamburger: false
  },
  display:
  {
    borderWidth: 8
  },
}

class Options implements OptionsValues
{
  battleAnimationTiming:
  {
    before: number;
    effectDuration: number;
    after: number;
    unitEnter: number;
    unitExit: number;
    turnTransition: number;
  };
  debug:
  {
    enabled: boolean;
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

  constructor()
  {
    this.setDefaults();
  }
  public setDefaultForCategory(category: OptionsCategory)
  {
    let shouldReRenderUI = false;
    let shouldReRenderMap = false;

    switch (category)
    {
      case "battleAnimationTiming":
        this.battleAnimationTiming = shallowCopy(defaultOptionsValues.battleAnimationTiming);
        break;

      case "debug":
        this.debug = shallowCopy(defaultOptionsValues.debug);

        if (this.debug.enabled !== defaultOptionsValues.debug.enabled)
        {
          shouldReRenderUI = true;
          shouldReRenderMap = true;
        }
        break;

      case "ui":
        this.ui = shallowCopy(defaultOptionsValues.ui);
        break;

      case "display":
        this.display = shallowCopy(defaultOptionsValues.display);

        if (this.display.borderWidth !== defaultOptionsValues.display.borderWidth)
        {
          shouldReRenderMap = true;
        }
        break;
    }

    if (shouldReRenderUI)
    {
      eventManager.dispatchEvent("renderUI");
    }
    if (shouldReRenderMap)
    {
      eventManager.dispatchEvent("renderMap");
    }
  }
  public setDefaults()
  {
    OptionsCategories.forEach((category) =>
    {
      this.setDefaultForCategory(category);
    });
  }
  public save(slot: number = 0)
  {
    var data = JSON.stringify(
    {
      options: this.serialize(),
      date: new Date()
    });

    var saveName = "Rance.Options." + slot;

    localStorage.setItem(saveName, data);
  }
  public load(slot?: number)
  {
    this.setDefaults();
    const parsedData = this.getParsedDataForSlot(slot);
    const parsedOptions: OptionsValues = this.serialize();

    if (parsedData)
    {
      // month goes 0-11
      const optionsToResetIfSetEarlierThan =
      {

      };

      const dateOptionsWereSaved = Date.parse(parsedData.date);

      for (let key in parsedData.options)
      {
        if (parsedOptions[key] !== undefined)
        {
          if (optionsToResetIfSetEarlierThan[key] && dateOptionsWereSaved <= optionsToResetIfSetEarlierThan[key])
          {
            console.log("Reset option: " + key);
          }
          else
          {
            parsedOptions[key] = deepMerge<any>(parsedOptions[key], parsedData.options[key]);
          }
        }
      }

      this.deSerialize(parsedOptions);
    }
  }

  private getParsedDataForSlot(slot?: number)
  {
    var baseString = "Rance.Options.";

    var parsedData:
    {
      date: string;
      options: OptionsValues;
    };
    if (isFinite(slot))
    {
      if (!localStorage[baseString + slot])
      {
        throw new Error("No options saved in that slot");
      }

      parsedData = JSON.parse(localStorage.getItem(baseString + slot));
    }
    else
    {
      parsedData = getMatchingLocalstorageItemsByDate(baseString)[0];
    }

    return parsedData;
  }
  private serialize(): OptionsValues
  {
    return(
    {
      battleAnimationTiming: this.battleAnimationTiming,
      debug: this.debug,
      ui: this.ui,
      display: this.display
    });
  }
  private deSerialize(data: OptionsValues)
  {
    this.battleAnimationTiming = deepMerge<any>(this.battleAnimationTiming, data.battleAnimationTiming, true);
    this.debug = deepMerge<any>(this.debug, data.debug, true);
    this.ui = deepMerge<any>(this.ui, data.ui, true);
    this.display = deepMerge<any>(this.display, data.display, true);
  }
}

const options = new Options();
export default options;
