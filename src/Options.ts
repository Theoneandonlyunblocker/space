import * as localForage from "localforage";

import {eventManager} from "./eventManager";
import
{
  deepMerge,
  extendObject,
  getFunctionName,
} from "./utility";
import { Language } from "./localization/Language";
import {app} from "./App";
import
{
  ReviversByVersion,
  fetchNeededReviversForData,
} from "./reviveSaveData";
import { activeModuleData } from "./activeModuleData";
import { ErrorReportingMode } from "./handleError";
import { storageStrings } from "./storageStrings";
import * as debug from "./debug";
// tslint:disable-next-line:no-duplicate-imports
import {LoggingCategory} from "./debug"; // throws errors if used as debug.LoggingCategory

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
    logging: {[k in LoggingCategory]: boolean};
  };
  display:
  {
    noHamburger: boolean;
  };
  system:
  {
    errorReporting: ErrorReportingMode;
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
  date: string;
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
      ai: false,
      graphics: false,
      saves: true,
      modules: true,
      init: true,
    },
  },
  display:
  {
    language: undefined,
    noHamburger: false,
  },
  system:
  {
    errorReporting: "alertOnce",
  },
};

// TODO 2019.07.06 |
class _Options implements OptionsValues
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
    logging: {[k in LoggingCategory]: boolean};
  };
  display:
  {
    language: Language;
    noHamburger: boolean;
  };
  system:
  {
    errorReporting: ErrorReportingMode;
  };

  constructor()
  {

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

        if (!this.display.language)
        {
          this.display.language = activeModuleData.getDefaultLanguage();
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
  public save(): Promise<string>
  {
    const data: OptionsSaveData =
    {
      options: this.serialize(),
      date: new Date().toISOString(),
      appVersion: app.version,
    };

    return localForage.setItem(storageStrings.options, JSON.stringify(data));
  }
  public load(): Promise<void>
  {
    debug.log("init", "Start loading options");

    this.setDefaults();

    return localForage.getItem<string>(storageStrings.options).then(savedData =>
    {
      const parsedData = JSON.parse(savedData);

      if (parsedData)
      {
        const revivedData = this.reviveOptionsSaveData(parsedData);
        this.deserialize(revivedData.options);
      }

      debug.log("init", "Finish loading options");
    });
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
    };
    this.system = deepMerge(this.system, data.system, true);
  }
  private reviveOptionsSaveData(toRevive: any): OptionsSaveData
  {
    const revived: OptionsSaveData = {...toRevive};

    const reviversByOptionsVersion: ReviversByVersion =
    {
      "0.0.0":
      [
        (data) =>
        {
          data.appVersion = "0.0.0";
        },
        (data) =>
        {
          data.options.battle = {};
          data.options.battle.animationTiming = {...data.options.battleAnimationTiming};
          delete data.options.battleAnimationTiming;

          data.options.display.noHamburger = data.options.ui.noHamburger;
          delete data.options.ui;
          delete data.options.display.borderWidth;

          data.options.system = {};
        }
      ],
    };

    const reviversToExecute = fetchNeededReviversForData(
      revived.appVersion,
      app.version,
      reviversByOptionsVersion,
    );

    reviversToExecute.forEach(reviverFN =>
    {
      debug.log("saves", `Executing stored options reviver function '${getFunctionName(reviverFN)}'`);
      reviverFN(revived);
    });

    return revived;
  }
}

// TODO 2019.07.06 |
export const Options = new _Options();
