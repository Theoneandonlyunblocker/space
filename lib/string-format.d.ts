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

type formatter = typeof formatString;
type transformer = (s: string) => string;

declare function formatString(toFormat: string, ...args: (any | {[key: string]: any})[]): string;
declare namespace formatString
{
  function create(transformers?: {[key: string]: transformer}): formatter;
}
