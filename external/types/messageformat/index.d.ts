declare class MessageFormat
{
  constructor(locale: MessageFormat.Locale);

  public addFormatters(formatters: {[key: string]: MessageFormat.FormatterFunction}): void;
  // has other forms as well
  public compile<P>(message: string): MessageFormat.MessageFunction<P>;
}

declare namespace MessageFormat
{
  // actually string | Array.<string> | Object.<string, function()>	<optional>
  type Locale = string;
  type MessageFunction<T> = (...args: T[]) => string;
  type FormatterFunction = (value: any, currentLocale?: Locale, arg?: string) => string;
}

declare module "messageformat"
{
  export = MessageFormat;
}
