import {BattleScripts} from "./modulescriptinterfaces/BattleScripts";
import {DiplomacyScripts} from "./modulescriptinterfaces/DiplomacyScripts";
import {GameScripts} from "./modulescriptinterfaces/GameScripts";
import {PlayerScripts} from "./modulescriptinterfaces/PlayerScripts";
import {UnitScripts} from "./modulescriptinterfaces/UnitScripts";

import {ModuleScriptData, ScriptsWithData} from "./ModuleScriptData";


type AllModuleScriptTypes =
{
  battle: BattleScripts;
  diplomacy: DiplomacyScripts;
  game: GameScripts;
  player: PlayerScripts;
  unit: UnitScripts;
};

// why doesn't this work directly?
type _dummy_<ScriptTypes extends
{
  [C in keyof ScriptTypes]:
  {
    [K in keyof ScriptTypes[C]]: (...args: any[]) => void;
  }
}> =
{
  [C in keyof ScriptTypes]: ScriptsWithData<ScriptTypes[C]>;
};

type InnerPartial<T> =
{
  [K in keyof T]: Partial<T[K]>;
};



type AllModuleScriptsWithData = _dummy_<AllModuleScriptTypes>;

type PartialModuleScriptsWithData = Partial<InnerPartial<AllModuleScriptsWithData>>;

type ScriptsCollection<S extends {[C in keyof S]: (...args: any[]) => void}> =
{
  [C in keyof S]: S[C][];
};

type AllModuleScripts =
{
  [C in keyof AllModuleScriptTypes]:
  {
    [K in keyof AllModuleScriptTypes[C]]: AllModuleScriptTypes[C][K][];
  }
};

// TODO 2017.06.13 | move non-internal stuff from eventManager to here
export default class ModuleScripts implements AllModuleScripts
{
  /* tslint:disable:member-ordering */
  private readonly scriptsWithData: AllModuleScriptsWithData =
  {
    battle:
    {
      battleFinish: [],
    },
    diplomacy:
    {
      onWarDeclaration: [],
    },
    game:
    {
      afterInit: [],
    },
    player:
    {
      onDeath: [],
    },
    unit:
    {
      removeFromPlayer: [],
      onCapture: [],
    },
  };

  public readonly battle    : ScriptsCollection<BattleScripts>    = ModuleScripts.makeAccessorObject(this.scriptsWithData.battle);
  public readonly diplomacy : ScriptsCollection<DiplomacyScripts> = ModuleScripts.makeAccessorObject(this.scriptsWithData.diplomacy);
  public readonly game      : ScriptsCollection<GameScripts>      = ModuleScripts.makeAccessorObject(this.scriptsWithData.game);
  public readonly player    : ScriptsCollection<PlayerScripts>    = ModuleScripts.makeAccessorObject(this.scriptsWithData.player);
  public readonly unit      : ScriptsCollection<UnitScripts>      = ModuleScripts.makeAccessorObject(this.scriptsWithData.unit);
  /* tslint:enable:member-ordering */

  constructor()
  {

  }

  public static merge(...toMerge: ModuleScripts[]): ModuleScripts
  {
    const merged = new ModuleScripts();

    toMerge.forEach(moduleScripts =>
    {
      merged.add(moduleScripts.scriptsWithData);
    });

    return merged;
  }
  private static sort(a: ModuleScriptData<any>, b: ModuleScriptData<any>): number
  {
    return b.priority - a.priority;
  }
  private static makeAccessorObject<S extends {[T in keyof S]: (...args: any[]) => void}>(scriptsWithData: ScriptsWithData<S>): ScriptsCollection<S>
  {
    const accessorObject = <ScriptsCollection<S>> {};

    for (let scriptKey in scriptsWithData)
    {
      Object.defineProperty(accessorObject, scriptKey,
      {
        get: () => scriptsWithData[scriptKey].sort(ModuleScripts.sort).map(scriptData => scriptData.script),
      });
    }

    return accessorObject;
  }

  public add(...allScriptData: PartialModuleScriptsWithData[]): void
  {
    allScriptData.forEach(toAdd =>
    {
      for (let category in toAdd)
      {
        for (let scriptKey in toAdd[category])
        {
          this.scriptsWithData[category][scriptKey].push(...toAdd[category][scriptKey]);
        }
      }
    });
  }
  public remove(toRemove: PartialModuleScriptsWithData): void
  {
    for (let category in toRemove)
    {
      for (let scriptKey in toRemove[category])
      {
        this.scriptsWithData[category][scriptKey] =
          this.scriptsWithData[category][scriptKey].filter((scriptData: ModuleScriptData<any>) =>
        {
          return toRemove[category][scriptKey].indexOf(scriptData) !== -1;
        });
      }
    }
  }
}
