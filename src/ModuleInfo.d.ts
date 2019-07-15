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
  // TODO 2019.04.10 | use string[] to allow for fallbacks
  /**
   * url of the built module file
   */
  moduleFileUrl: string;
  /**
   * define("{{{THIS BIT HERE}}}", ["require", "exports",
   */
  moduleObjRequireJsName: string;
  // TODO 2019.07.15 | rename moduleObjVariableName
  /**
   * export const {{{THIS BIT HERE}}}: ModuleFile =
   * {
   *   info: moduleInfo,
   */
  moduleFileVariableName: string;
}
