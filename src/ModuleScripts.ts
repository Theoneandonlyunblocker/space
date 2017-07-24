import {BattleScripts} from "./modulescriptinterfaces/BattleScripts";
import {DiplomacyScripts} from "./modulescriptinterfaces/DiplomacyScripts";
import {GameScripts} from "./modulescriptinterfaces/GameScripts";
import {PlayerScripts} from "./modulescriptinterfaces/PlayerScripts";
import {UnitScripts} from "./modulescriptinterfaces/UnitScripts";

import {ModuleScriptData} from "./ModuleScriptData";


type ScriptsWithData<Scripts extends {[T in keyof Scripts]: (...args: any[]) => void}> =
{
  [T in keyof Scripts]: ModuleScriptData<Scripts[T]>[];
};

interface AllModuleScriptsWithData
{
  battle: ScriptsWithData<BattleScripts>;
  diplomacy: ScriptsWithData<DiplomacyScripts>;
  game: ScriptsWithData<GameScripts>;
  player: ScriptsWithData<PlayerScripts>;
  unit: ScriptsWithData<UnitScripts>;
}

// TODO 2017.06.13 | move non-internal stuff from eventManager to here
export default class ModuleScripts implements AllModuleScriptsWithData
{
  public readonly battle: ScriptsWithData<BattleScripts> =
  {
    battleFinish: [],
  };
  public readonly diplomacy: ScriptsWithData<DiplomacyScripts> =
  {
    onWarDeclaration: [],
  };
  public readonly game: ScriptsWithData<GameScripts> =
  {
    afterInit: [],
  };
  public readonly player: ScriptsWithData<PlayerScripts> =
  {
    onDeath: [],
  };
  public readonly unit: ScriptsWithData<UnitScripts> =
  {
    removeFromPlayer: [],
  };

  constructor()
  {

  }

  public static merge(...toMerge: ModuleScripts[]): ModuleScripts
  {
    const merged = new ModuleScripts();

    toMerge.forEach(moduleScripts =>
    {
      merged.add(moduleScripts);
    });

    return merged;
  }
  private static sort(a: ModuleScriptData<any>, b: ModuleScriptData<any>): number
  {
    return b.priority - a.priority;
  }

  public add(...allScriptData: Partial<AllModuleScriptsWithData>[]): void
  {
    allScriptData.forEach(toAdd =>
    {
      for (let category in toAdd)
      {
        for (let scriptType in toAdd[category])
        {
          this[category][scriptType].push(...toAdd[category][scriptType]);
        }
      }
    });
  }
  public remove(toRemove: Partial<AllModuleScriptsWithData>): void
  {
    for (let category in toRemove)
    {
      for (let scriptType in toRemove[category])
      {
        const ownScripts: Function[] = this[category][scriptType];
        const scriptsToRemove: Function[] = toRemove[category][scriptType];

        for (let j = 0; j < scriptsToRemove.length; j++)
        {
          for (let i = ownScripts.length - 1; i >= 0; i--)
          {
            if (ownScripts[i] === scriptsToRemove[j])
            {
              ownScripts.splice(i, 1);

              break;
            }
          }
        }
      }
    }
  }
  public get<T extends (...args: any[]) => void>(allScriptData: ModuleScriptData<T>[]): T[]
  {
    return allScriptData.sort(ModuleScripts.sort).map(scriptData =>
    {
      return scriptData.script;
    });
  }
}
