import eventManager from "./eventManager";
import
{
  deepMerge,
  getMatchingLocalstorageItemsByDate,
  shallowCopy,
} from "./utility";


type OptionsCategory = "battleAnimationTiming" | "debug" | "ui" | "display";
type OptionsSubCatgory = "debug.logging";
const optionsCategories: OptionsCategory[] =
[
  "battleAnimationTiming", "debug", "ui", "display",
];

interface OptionsValues
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
    aiVsPlayerBattleSimulationDepth: number;
    aiVsAiBattleSimulationDepth: number;
    logging:
    {
      ai: boolean;
      graphics: boolean;
    };
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

const defaultOptionsValues: OptionsValues =
{
  battleAnimationTiming:
  {
    before: 750,
    effectDuration: 1,
    after: 1500,
    unitEnter: 200,
    unitExit: 100,
    turnTransition: 500,
  },
  debug:
  {
    enabled: false,
    aiVsPlayerBattleSimulationDepth: 1000,
    aiVsAiBattleSimulationDepth: 20,
    logging:
    {
      ai: true,
      graphics: true,
    },
  },
  ui:
  {
    noHamburger: false,
  },
  display:
  {
    borderWidth: 8,
  },
};

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
    aiVsPlayerBattleSimulationDepth: number;
    aiVsAiBattleSimulationDepth: number;
    logging:
    {
      ai: boolean;
      graphics: boolean;
    };
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
  public setDefaultForCategory(category: OptionsCategory | OptionsSubCatgory)
  {
    let shouldReRenderUI = false;
    let shouldReRenderMap = false;

    switch (category)
    {
      case "battleAnimationTiming":
      {
        this.battleAnimationTiming = shallowCopy(defaultOptionsValues.battleAnimationTiming);

        break;
      }
      case "debug":
      {
        this.debug = shallowCopy(defaultOptionsValues.debug);

        if (this.debug.enabled !== defaultOptionsValues.debug.enabled)
        {
          shouldReRenderUI = true;
          shouldReRenderMap = true;
        }

        break;
      }
      case "debug.logging":
      {
        this.debug.logging = shallowCopy(defaultOptionsValues.debug.logging);

        break;
      }
      case "ui":
      {
        this.ui = shallowCopy(defaultOptionsValues.ui);

        break;
      }
      case "display":
      {
        this.display = shallowCopy(defaultOptionsValues.display);

        if (this.display.borderWidth !== defaultOptionsValues.display.borderWidth)
        {
          shouldReRenderMap = true;
        }

        break;
      }
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
    optionsCategories.forEach(category =>
    {
      this.setDefaultForCategory(category);
    });
  }
  public save(slot: number = 0)
  {
    const data = JSON.stringify(
    {
      options: this.serialize(),
      date: new Date(),
    });

    const saveName = "Rance.Options." + slot;

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

      for (const key in parsedData.options)
      {
        if (parsedOptions[key] !== undefined)
        {
          if (optionsToResetIfSetEarlierThan[key] && dateOptionsWereSaved <= optionsToResetIfSetEarlierThan[key])
          {
            console.log(`Reset option: ${key}`);
          }
          else
          {
            parsedOptions[key] = deepMerge(parsedOptions[key], parsedData.options[key]);
          }
        }
      }

      this.deserialize(parsedOptions);
    }
  }

  private getParsedDataForSlot(slot?: number)
  {
    const baseString = "Rance.Options.";

    let parsedData:
    {
      date: string;
      options: OptionsValues;
    };
    if (slot !== undefined)
    {
      const savedData = localStorage.getItem(baseString + slot);

      if (!savedData)
      {
        throw new Error("No options saved in that slot");
      }

      parsedData = JSON.parse(savedData);
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
      display: this.display,
    });
  }
  private deserialize(data: OptionsValues)
  {
    this.battleAnimationTiming = deepMerge(this.battleAnimationTiming, data.battleAnimationTiming, true);
    this.debug = deepMerge(this.debug, data.debug, true);
    this.ui = deepMerge(this.ui, data.ui, true);
    this.display = deepMerge(this.display, data.display, true);
  }
}

const options = new Options();
export default options;
