import { ModifierTemplate } from "./ModifierTemplate";


export class Modifier<T extends ModifierTemplate<any>>
{
  public readonly parent: Modifier<any>;
  public readonly template: T;
  public isActive: boolean;

  constructor(template: T, isActive: boolean, parent?: Modifier<any>)
  {
    this.parent = parent;
    this.template = template;
    this.isActive = isActive;
  }
}
