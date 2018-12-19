export interface ModuleInfo
{
  key: string;
  // displayName: string;
  version: string;
  author?: string;
  description?: string;
  // these don't define dependencies, just for arranging load order
  modsToLoadBefore?: string[];
  modsToLoadAfter?: string[];
  // should be used very, very sparingly
  // if this mod replaces another's functionality, replace old name after this mod has been renamed, etc.
  modsToReplace?: string[];
  /**
   * should point to an address that can serve a 'moduleInfo.json' file
   * leaving this blank will only allow local loading
   * if loaded locally, 'mods\/**\/moduleInfo.json' is used instead
   */
  remoteModuleInfoUrl?: string;
  /**
   * url of the actual module file relative to 'moduleInfo.json'
   */
  moduleFileUrl: string;
  // TODO 2019.04.02 | rename
  moduleFileVariableName: string;
}
