import { TriggeredScriptsWithData, TriggeredScriptData } from "./TriggeredScriptsWithData";


export class TriggeredScriptCollection<T extends {[K in keyof T]: (...args: any) => void}>
{
  private readonly scriptsWithData: Partial<TriggeredScriptsWithData<T>> = {};

  constructor(initialScriptsToAdd?: Partial<TriggeredScriptsWithData<T>>)
  {
    if (initialScriptsToAdd)
    {
      this.add(initialScriptsToAdd);
    }
  }

  public add(
    scriptsToAdd: Partial<TriggeredScriptsWithData<T>>,
  ): void
  {
    for (const scriptType in scriptsToAdd)
    {
      if (!this.scriptsWithData[scriptType])
      {
        this.scriptsWithData[scriptType] = {};
      }

      for (const scriptIdentifier in scriptsToAdd[scriptType])
      {
        if (this.scriptsWithData[scriptType][scriptIdentifier])
        {
          throw new Error(`Duplicate triggered script identifier '${scriptType}.${scriptIdentifier}'`);
        }

        this.scriptsWithData[scriptType][scriptIdentifier] = scriptsToAdd[scriptType][scriptIdentifier];
      }
    }
  }
  public call<S extends keyof T>(scriptType: S, ...args: Parameters<T[S]>): void
  {
    const scriptsOfType = this.scriptsWithData[scriptType] || {};

    const sortedScriptData = TriggeredScriptCollection.sortTriggeredScriptData(scriptsOfType);
    sortedScriptData.forEach(scriptData =>
    {
      scriptData.callback(...args);
    });
  }

  private static sortTriggeredScriptData<T extends (...args: any) => void>(
    scriptDataByIdentifier: {[scriptIdentifier: string]: TriggeredScriptData<T>},
  ): TriggeredScriptData<T>[]
  {
    return Object.keys(scriptDataByIdentifier).map(scriptIdentifier =>
    {
      return scriptDataByIdentifier[scriptIdentifier];
    }).sort((a, b) =>
    {
      return b.triggerPriority - a.triggerPriority;
    });
  }
}
