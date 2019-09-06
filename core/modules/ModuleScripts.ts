import {BattleScripts} from "../modulescriptinterfaces/BattleScripts";
import {DiplomacyScripts} from "../modulescriptinterfaces/DiplomacyScripts";
import {GameScripts} from "../modulescriptinterfaces/GameScripts";
import {PlayerScripts} from "../modulescriptinterfaces/PlayerScripts";
import {StarScripts} from "../modulescriptinterfaces/StarScripts";
import {UnitScripts} from "../modulescriptinterfaces/UnitScripts";


type AllModuleScriptTypes =
{
  battle: BattleScripts;
  diplomacy: DiplomacyScripts;
  game: GameScripts;
  player: PlayerScripts;
  star: StarScripts;
  unit: UnitScripts;
};

interface ModuleScriptData<T extends (...args: any[]) => void>
{
  key: string;
  priority: number; // 0 should be considered default
  script: T;
}

type ScriptsWithData<Scripts extends {[T in keyof Scripts]: (...args: any[]) => void}> =
{
  [T in keyof Scripts]: ModuleScriptData<Scripts[T]>[];
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



export type AllModuleScriptsWithData = _dummy_<AllModuleScriptTypes>;

export type PartialModuleScriptsWithData = Partial<InnerPartial<AllModuleScriptsWithData>>;

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

export class ModuleScripts implements AllModuleScripts
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
      onFirstMeeting: [],
    },
    game:
    {
      afterInit: [],
      beforePlayerTurnEnd: [],
    },
    player:
    {
      onDeath: [],
    },
    star:
    {
      onOwnerChange: [],
    },
    unit:
    {
      removeFromPlayer: [],
      onCapture: [],
    },
  };

  /* tslint:disable:typedef-whitespace */
  public readonly battle    : ScriptsCollection<BattleScripts>    = ModuleScripts.makeAccessorObject(this.scriptsWithData.battle);
  public readonly diplomacy : ScriptsCollection<DiplomacyScripts> = ModuleScripts.makeAccessorObject(this.scriptsWithData.diplomacy);
  public readonly game      : ScriptsCollection<GameScripts>      = ModuleScripts.makeAccessorObject(this.scriptsWithData.game);
  public readonly player    : ScriptsCollection<PlayerScripts>    = ModuleScripts.makeAccessorObject(this.scriptsWithData.player);
  public readonly star      : ScriptsCollection<StarScripts>      = ModuleScripts.makeAccessorObject(this.scriptsWithData.star);
  public readonly unit      : ScriptsCollection<UnitScripts>      = ModuleScripts.makeAccessorObject(this.scriptsWithData.unit);
  /* tslint:enable:typedef-whitespace */
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

    for (const scriptKey in scriptsWithData)
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
      for (const category in toAdd)
      {
        for (const scriptKey in toAdd[category])
        {
          this.scriptsWithData[category][scriptKey].push(...toAdd[category][scriptKey]);
        }
      }
    });
  }
  public remove(toRemove: PartialModuleScriptsWithData): void
  {
    for (const category in toRemove)
    {
      for (const scriptKey in toRemove[category])
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
