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
  // if this mod replaces another's functionality, this mod has been renamed, etc.
  modsToReplace?: string[];
  // TODO 2019.04.10 | use string[] for the two below to allow fallbacks
  /**
   * should point to a http url that will serve a 'moduleInfo.json' file
   * leaving this blank will only allow local loading
   * used to check version, fetch mods for savegame etc after mod info has already otherwise been loaded in app
   */
  remoteModuleInfoUrl?: string;
  /**
   * url of the actual module file relative to 'moduleInfo.json'
   */
  moduleFileUrl: string;
  // TODO 2019.04.02 | rename
  moduleFileVariableName: string;
}
