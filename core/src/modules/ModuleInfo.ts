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

  /**
   * note: used as baseUrl for relative assets as well
   *
   * eg. ["{DOCUMENT_PATH}/dist/modules/example.js", "https://remotehost.org/spacegame/modules/example/index.js"]
   *
   * macros:
   *  {DOCUMENT_PATH} => document.URL.origin + document.URL.pathName (document.URL without hash, querystring)
   */
  moduleBundleUrls: string[];

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
