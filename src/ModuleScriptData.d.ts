export declare interface ModuleScriptData<T extends (...args: any[]) => void>
{
  key: string;
  priority: number; // 0 should be considered default
  script: T;
}
