import eventManager from "./eventManager";
import
{
  deepMerge,
  extendObject,
  getMatchingLocalStorageItemsSortedByDate,
} from "./utility";
import { Language } from "./localization/Language";
import app from "./App";
import
{
  ReviversByVersion,
  fetchNeededReviversForData,
} from "./reviveSaveData";
import { activeModuleData } from "./activeModuleData";


type OptionsCategory = "battle" | "debug" | "display" | "system";
type OptionsSubCatgory = "battle.animationTiming" | "debug.logging";
const optionsCategories: OptionsCategory[] =
[
  "battle", "debug", "display", "system",
];


type BaseOptionsValues =
{
  battle:
  {
    animationTiming:
    {
      before: number;
      effectDuration: number;
      after: number;
      unitEnter: number;
      unitExit: number;
      turnTransition: number;
    };
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
  display:
  {
    borderWidth: number;
    noHamburger: boolean;
  };
  system:
  {
    errorReporting: "ignore" | "alert" | "panic";
  };
};

type OptionsValues = BaseOptionsValues &
{
  display:
  {
    language: Language;
  };
};

type SerializedOptionsValues = BaseOptionsValues &
{
  display:
  {
    languageCode: string;
  };
};

type OptionsSaveData =
{
  options: SerializedOptionsValues;
  date: Date;
  appVersion: string;
};

const defaultOptionsValues: OptionsValues =
{
  battle:
  {
    animationTiming:
    {
      before: 750,
      effectDuration: 1,
      after: 1500,
      unitEnter: 200,
      unitExit: 100,
      turnTransition: 500,
    },
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
  display:
  {
    language: undefined,
    noHamburger: false,
    borderWidth: 8,
  },
  system:
  {
    errorReporting: "alert",
  },
};

class Options implements OptionsValues
{
  battle:
  {
    animationTiming:
    {
      before: number;
      effectDuration: number;
      after: number;
      unitEnter: number;
      unitExit: number;
      turnTransition: number;
    };
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
  display:
  {
    language: Language;
    borderWidth: number;
    noHamburger: boolean;
  };
  system:
  {
    errorReporting: "ignore" | "alert" | "panic";
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
      case "battle":
      {
        this.battle = extendObject(defaultOptionsValues.battle);

        break;
      }
      case "battle.animationTiming":
      {
        this.battle.animationTiming = extendObject(defaultOptionsValues.battle.animationTiming);

        break;
      }
      case "debug":
      {
        this.debug = extendObject(defaultOptionsValues.debug);

        if (this.debug.enabled !== defaultOptionsValues.debug.enabled)
        {
          shouldReRenderUI = true;
          shouldReRenderMap = true;
        }

        break;
      }
      case "debug.logging":
      {
        this.debug.logging = extendObject(defaultOptionsValues.debug.logging);

        break;
      }
      case "display":
      {
        const previouslySetLanguage = this.display ? this.display.language : undefined;

        this.display = extendObject(defaultOptionsValues.display);
        this.display.language = previouslySetLanguage;

        if (this.display.borderWidth !== defaultOptionsValues.display.borderWidth)
        {
          shouldReRenderMap = true;
        }
        if (this.display.noHamburger !== defaultOptionsValues.display.noHamburger)
        {
          shouldReRenderUI = true;
        }

        break;
      }
      case "system":
      {
        this.system = extendObject(defaultOptionsValues.system);
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
    const data: OptionsSaveData =
    {
      options: this.serialize(),
      date: new Date(),
      appVersion: app.version,
    };

    const saveName = "Rance.Options." + slot;

    localStorage.setItem(saveName, JSON.stringify(data));
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

  private getParsedDataForSlot(slot?: number): OptionsSaveData
  {
    const baseString = "Rance.Options.";

    let parsedData: OptionsSaveData;
    if (slot !== undefined)
    {
      const savedData = localStorage.getItem(baseString + slot);

      if (!savedData)
      {
        throw new Error(`No such localStorage key: ${baseString + slot}`);
      }

      parsedData = JSON.parse(savedData);
    }
    else
    {
      parsedData = getMatchingLocalStorageItemsSortedByDate<OptionsSaveData>(baseString)[0];
    }

    return parsedData;
  }
  private serialize(): SerializedOptionsValues
  {
    return(
    {
      battle: this.battle,
      debug: this.debug,
      display:
      {
        languageCode: this.display.language.code,
        noHamburger: this.display.noHamburger,
        borderWidth: this.display.borderWidth,
      },
      system: this.system,
    });
  }
  private deserialize(data: SerializedOptionsValues): void
  {
    this.battle = deepMerge(this.battle, data.battle, true);
    this.debug = deepMerge(this.debug, data.debug, true);
    this.display =
    {
      language: activeModuleData.fetchLanguageForCode(data.display.languageCode),
      noHamburger: data.display.noHamburger,
      borderWidth: data.display.borderWidth,
    };
    this.system = deepMerge(this.system, data.system, true);
  }
  }
}

const options = new Options();
export default options;
