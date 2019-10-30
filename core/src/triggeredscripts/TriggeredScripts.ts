import {BattleScripts} from "./BattleScripts";
import {DiplomacyScripts} from "./DiplomacyScripts";
import {GameScripts} from "./GameScripts";
import {PlayerScripts} from "./PlayerScripts";
import {StarScripts} from "./StarScripts";
import {UnitScripts} from "./UnitScripts";
import { allDefaultTriggeredScripts } from "./allDefaultTriggeredScripts";


type AllTriggeredScripts =
{
  battle: BattleScripts;
  diplomacy: DiplomacyScripts;
  game: GameScripts;
  player: PlayerScripts;
  star: StarScripts;
  unit: UnitScripts;
};
type TriggeredScriptData<T> =
{
  /**
   * higher priority scripts are triggered first
   * 0 should be considered the default
   */
  triggerPriority: number;
  script: T;
};

// no higher kinded types so lots of copy paste
// https://github.com/microsoft/TypeScript/issues/1213
export type AllTriggeredScriptsWithData =
{
  [Category in keyof AllTriggeredScripts]:
  {
    [TriggerKey in keyof AllTriggeredScripts[Category]]:
    {
      [scriptKey: string]: TriggeredScriptData<AllTriggeredScripts[Category][TriggerKey]>;
    };
  }
};
export type PartialTriggeredScriptsWithData =
{
  [Category in keyof AllTriggeredScripts]?:
  {
    [TriggerKey in keyof AllTriggeredScripts[Category]]?:
    {
      [scriptKey: string]: TriggeredScriptData<AllTriggeredScripts[Category][TriggerKey]>;
    }
  }
};
type ScriptsArrayForCategory<Category extends keyof AllTriggeredScripts> =
{
  [TriggerKey in keyof AllTriggeredScripts[Category]]: (AllTriggeredScripts[Category][TriggerKey])[];
};

export class TriggeredScripts
{
  /* tslint:disable:member-ordering */
  private readonly scriptsWithData: AllTriggeredScriptsWithData =
  {
    battle:
    {
      battleFinish: {},
    },
    diplomacy:
    {
      onWarDeclaration: {},
      onFirstMeeting: {},
    },
    game:
    {
      afterInit: {},
      beforePlayerTurnEnd: {},
    },
    player:
    {
      onDeath: {},
      onResourcesChange: {},
      onIncomeChange: {},
      onResearchSpeedChange: {},
    },
    star:
    {
      onOwnerChange: {},
    },
    unit:
    {
      removeFromPlayer: {},
      onCapture: {},
    },
  };

  /* tslint:disable:typedef-whitespace */
  public readonly battle    : ScriptsArrayForCategory<"battle">    = TriggeredScripts.makeAccessorObject(this.scriptsWithData.battle);
  public readonly diplomacy : ScriptsArrayForCategory<"diplomacy"> = TriggeredScripts.makeAccessorObject(this.scriptsWithData.diplomacy);
  public readonly game      : ScriptsArrayForCategory<"game">      = TriggeredScripts.makeAccessorObject(this.scriptsWithData.game);
  public readonly player    : ScriptsArrayForCategory<"player">    = TriggeredScripts.makeAccessorObject(this.scriptsWithData.player);
  public readonly star      : ScriptsArrayForCategory<"star">      = TriggeredScripts.makeAccessorObject(this.scriptsWithData.star);
  public readonly unit      : ScriptsArrayForCategory<"unit">      = TriggeredScripts.makeAccessorObject(this.scriptsWithData.unit);
  /* tslint:enable:typedef-whitespace */
  /* tslint:enable:member-ordering */

  constructor()
  {
    this.add(allDefaultTriggeredScripts);
  }

  public static merge(...toMerge: TriggeredScripts[]): TriggeredScripts
  {
    const merged = new TriggeredScripts();

    toMerge.forEach(scripts =>
    {
      merged.add(scripts.scriptsWithData);
    });

    return merged;
  }

  public add(...allScriptData: PartialTriggeredScriptsWithData[]): void
  {
    allScriptData.forEach(toAdd =>
    {
      for (const category in toAdd)
      {
        for (const triggerKey in toAdd[category])
        {
          const existingScriptsForTrigger: {[scriptKey: string]: TriggeredScriptData<any>} = this.scriptsWithData[category][triggerKey];
          const toAddScriptsForTrigger: {[scriptKey: string]: TriggeredScriptData<any>} = toAdd[category][triggerKey];
          for (const scriptKey in toAddScriptsForTrigger)
          {
            if (existingScriptsForTrigger[scriptKey])
            {
              throw new Error(`Duplicate triggered script '${category}.${triggerKey}.${scriptKey}'`);
            }

            existingScriptsForTrigger[scriptKey] = toAddScriptsForTrigger[scriptKey];
          }
        }
      }
    });
  }

  private static triggerPrioritySort(a: TriggeredScriptData<any>, b: TriggeredScriptData<any>): number
  {
    return b.triggerPriority - a.triggerPriority;
  }
  private static makeAccessorObject<C extends keyof AllTriggeredScriptsWithData>(scriptsForCategory: AllTriggeredScriptsWithData[C]): ScriptsArrayForCategory<C>
  {
    return new Proxy(<ScriptsArrayForCategory<C>>{},
    {
      get: (obj, triggerKey) =>
      {
        return Object.keys(scriptsForCategory[triggerKey]).map(scriptKeys =>
        {
          return scriptsForCategory[triggerKey][scriptKeys];
        }).sort(TriggeredScripts.triggerPrioritySort).map(scriptData => scriptData.script);
      },
    });
  }
}
