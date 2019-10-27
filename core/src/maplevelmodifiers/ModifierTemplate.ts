// base type for map level modifiers (StarModifiers, UnitModifiers) etc.
export interface ModifierTemplate<P extends {[K in keyof P]?: ModifierTemplate<any>}>
{
  key: string;
  displayName?: string;
  description?: string;
  getIcon?: () => HTMLElement | SVGElement;

  propagations?: P;
}
