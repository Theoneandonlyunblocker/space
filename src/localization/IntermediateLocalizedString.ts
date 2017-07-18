/// <reference path="../../lib/string-format.d.ts" />

const formatters =
{
  capitalize: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
};

const format = formatString.create(formatters);

export class IntermediateLocalizedString
{
  private value: string;

  constructor(value: string)
  {
    this.value = value;
  }

  // tslint:disable-next-line:no-any
  public format(...args: (any | {[key: string]: any})[]): string
  {
    return format(this.value, ...args);
  }
  public capitalize(): string
  {
    return formatters.capitalize(this.value);
  }
}
