declare type MessageFunction<T> = (...args: T[]) => string;

declare class MessageFormat
{
  // actually string | Array.<string> | Object.<string, function()>	<optional>
  constructor(locale: string);

  public addFormatters(formatters: {[key: string]: (toFormat: string, ...args: any[]) => string}): void;
  // has other forms as well
  public compile<P>(message: string): MessageFunction<P>;
}
