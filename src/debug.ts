import Options from "./Options";


type LoggingCategory = "ai" | "graphics" | "saves";

export function shouldLog(category: LoggingCategory): boolean
{
  return Options.debug.enabled && Options.debug.enabled && Options.debug.logging[category];
}

export function log(category: LoggingCategory, message?: any, ...optionalParams: any[]): void
{
  if (shouldLog(category))
  {
    console.log(`[${category.toUpperCase()}]`, message, ...optionalParams);
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
