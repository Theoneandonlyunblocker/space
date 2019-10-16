// base type for map level modifiers (StarModifiers, UnitModifiers) etc.
export interface Modifier<P extends {[K in keyof P]?: Modifier<any>}>
{
  key: string;
  displayName?: string;
  description?: string;
  getIcon?: () => HTMLElement | SVGElement;

  propagations?: P;
}
