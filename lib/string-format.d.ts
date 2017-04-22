/**
 * https://github.com/davidchambers/string-format
 * simple args
 * formatString("a", new Date())
 *   String(arg);
 * object args
 * formatString({a: "a", getDate: () => new Date()})
 *   if typeof arg.prop === "function"
 *     String(call(arg.prop))
 *   else
 *     String(arg.prop)
 */

declare function formatString(toFormat: string, ...args: (any | {[key: string]: any})[]): string;
