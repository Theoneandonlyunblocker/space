import Options from "./Options";


type LoggingCategory = "ai" | "graphics" | "saves" | "init" | "modules";

export function shouldLog(category: LoggingCategory): boolean
{
  if (!Options || !Options.debug)
  {
    return true;
  }

  // don't check if debug mode itself is enabled
  // user needs to open dev console to see these anyway
  // could use different enviroments etc instead
  return Options.debug.logging[category];
}

export function log(category: LoggingCategory, message?: any, ...optionalParams: any[]): void
{
  if (shouldLog(category))
  {
    console.log(`[${category.toUpperCase()}]`, Date.now(), message, ...optionalParams);
  }
}

export function table(category: LoggingCategory, header: string, rows: any[]): void
{
  if (shouldLog(category))
  {
    log(category, header);
  }

  console.table(rows);
}
