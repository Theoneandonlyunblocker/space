/// <reference path="../../lib/string-format.d.ts" />

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
    return formatString(this.value, ...args);
  }
}
