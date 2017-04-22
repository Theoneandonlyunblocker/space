/// <reference path="../../lib/string-format.d.ts" />

export class IntermediateLocalizedString
{
  private value: string;

  constructor(value: string)
  {
    this.value = value;
  }

  // tslint:disable-next-line
  public format(...args: any[]): string
  {
    return formatString(this.value, args);
  }
}
