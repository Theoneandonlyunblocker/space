// actually string | Array.<string> | Object.<string, function()>	<optional>
declare type Locale = string;
declare type MessageFunction<T> = (...args: T[]) => string;
declare type FormatterFunction = (value: any, currentLocale?: Locale, arg?: string) => string;

declare class MessageFormat
{
  constructor(locale: Locale);

  public addFormatters(formatters: {[key: string]: FormatterFunction}): void;
  // has other forms as well
  public compile<P>(message: string): MessageFunction<P>;
}
