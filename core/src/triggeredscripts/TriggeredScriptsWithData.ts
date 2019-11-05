export type TriggeredScriptData<T extends (...args: any) => void> =
{
  /**
   * higher priority scripts are triggered first
   * 0 should be considered the default
   */
  triggerPriority: number;
  callback: T;
};

export type TriggeredScriptsWithData<T extends {[K in keyof T]: (...args: any) => void}> =
{
  [K in keyof T]:
  {
    [scriptIdentifier: string]: TriggeredScriptData<T[K]>;
  };
};
