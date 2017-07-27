export declare interface ModuleScriptData<T extends (...args: any[]) => void>
{
  key: string;
  priority: number; // 0 should be considered default
  script: T;
}

export declare type ScriptsWithData<Scripts extends {[T in keyof Scripts]: (...args: any[]) => void}> =
{
  [T in keyof Scripts]: ModuleScriptData<Scripts[T]>[];
};
