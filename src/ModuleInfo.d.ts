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

  // TODO 2019.08.04 | use string[] to allow for fallbacks
  moduleBundleUrl: string;

  /**
   * define("{{{THIS BIT HERE}}}", ["require", "exports",
   */
  moduleObjRequireJsName: string;

  /**
   * export const {{{THIS BIT HERE}}}: GameModule =
   * {
   *   info: moduleInfo,
   */
  gameModuleVariableName: string;
}
