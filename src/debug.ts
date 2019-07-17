import {options} from "./Options";


type LogFn = (message?: any, ...optionalParams: any[]) => void;
type DebugLogFn = (category: LoggingCategory, message?: any, ...optionalParams: any[]) => void;

export type LoggingCategory = "ai" | "graphics" | "saves" | "init" | "modules";

export function shouldLog(category: LoggingCategory): boolean
{
  if (!options || !options.debug)
  {
    return true;
  }

  // don't check if debug mode itself is enabled
  // user needs to open dev console to see these anyway
  // could use different enviroments etc instead
  return options.debug.logging[category];
}
export const log = createWrappedLogLikeFunction(console.log);
export const warn = createWrappedLogLikeFunction(console.warn);
export function table(category: LoggingCategory, header: string, rows: any[]): void
{
  if (shouldLog(category))
  {
    log(category, header);
  }

  console.table(rows);
}

function createWrappedLogLikeFunction(toWrap: LogFn): DebugLogFn
{
  return (category: LoggingCategory, message?: any, ...optionalParams: any[]) =>
  {
    if (shouldLog(category))
    {
      toWrap(`[${category.toUpperCase()}]`, Date.now(), message, ...optionalParams);
    }
  };
}
