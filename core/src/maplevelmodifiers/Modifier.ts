import { ModifierTemplate } from "./ModifierTemplate";


export class Modifier<T extends ModifierTemplate<any>>
{
  public readonly parent: Modifier<any>;
  public readonly template: T;
  public isActive: boolean = false;

  constructor(template: T, parent?: Modifier<any>)
  {
    this.parent = parent;
    this.template = template;
  }
}
