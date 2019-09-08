import {BattleScripts} from "./BattleScripts";
import {DiplomacyScripts} from "./DiplomacyScripts";
import {GameScripts} from "./GameScripts";
import {PlayerScripts} from "./PlayerScripts";
import {StarScripts} from "./StarScripts";
import {UnitScripts} from "./UnitScripts";


type AllTriggeredScriptTypes =
{
  battle: BattleScripts;
  diplomacy: DiplomacyScripts;
  game: GameScripts;
  player: PlayerScripts;
  star: StarScripts;
  unit: UnitScripts;
};

interface TriggeredScriptData<T extends (...args: any[]) => void>
{
  key: string;
  priority: number; // 0 should be considered default
  script: T;
}

type ScriptsWithData<Scripts extends {[T in keyof Scripts]: (...args: any[]) => void}> =
{
  [T in keyof Scripts]: TriggeredScriptData<Scripts[T]>[];
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



export type AllTriggeredScriptsWithData = _dummy_<AllTriggeredScriptTypes>;

export type PartialTriggeredScriptsWithData = Partial<InnerPartial<AllTriggeredScriptsWithData>>;

type ScriptsCollection<S extends {[C in keyof S]: (...args: any[]) => void}> =
{
  [C in keyof S]: S[C][];
};

type AllTriggeredScripts =
{
  [C in keyof AllTriggeredScriptTypes]:
  {
    [K in keyof AllTriggeredScriptTypes[C]]: AllTriggeredScriptTypes[C][K][];
  }
};

export class TriggeredScripts implements AllTriggeredScripts
{
  /* tslint:disable:member-ordering */
  private readonly scriptsWithData: AllTriggeredScriptsWithData =
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
  public readonly battle    : ScriptsCollection<BattleScripts>    = TriggeredScripts.makeAccessorObject(this.scriptsWithData.battle);
  public readonly diplomacy : ScriptsCollection<DiplomacyScripts> = TriggeredScripts.makeAccessorObject(this.scriptsWithData.diplomacy);
  public readonly game      : ScriptsCollection<GameScripts>      = TriggeredScripts.makeAccessorObject(this.scriptsWithData.game);
  public readonly player    : ScriptsCollection<PlayerScripts>    = TriggeredScripts.makeAccessorObject(this.scriptsWithData.player);
  public readonly star      : ScriptsCollection<StarScripts>      = TriggeredScripts.makeAccessorObject(this.scriptsWithData.star);
  public readonly unit      : ScriptsCollection<UnitScripts>      = TriggeredScripts.makeAccessorObject(this.scriptsWithData.unit);
  /* tslint:enable:typedef-whitespace */
  /* tslint:enable:member-ordering */

  constructor()
  {

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
        for (const scriptKey in toAdd[category])
        {
          this.scriptsWithData[category][scriptKey].push(...toAdd[category][scriptKey]);
        }
      }
    });
  }
  public remove(toRemove: PartialTriggeredScriptsWithData): void
  {
    for (const category in toRemove)
    {
      for (const scriptKey in toRemove[category])
      {
        this.scriptsWithData[category][scriptKey] =
          this.scriptsWithData[category][scriptKey].filter((scriptData: TriggeredScriptData<any>) =>
        {
          return toRemove[category][scriptKey].indexOf(scriptData) !== -1;
        });
      }
    }
  }

  private static sort(a: TriggeredScriptData<any>, b: TriggeredScriptData<any>): number
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
        get: () => scriptsWithData[scriptKey].sort(TriggeredScripts.sort).map(scriptData => scriptData.script),
      });
    }

    return accessorObject;
  }
}
