/// <reference path="../../lib/string-format.d.ts" />

import {transformers} from "./transformers";

const format = formatString.create(transformers);

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
    return transformers.capitalize(this.value);
  }
}
