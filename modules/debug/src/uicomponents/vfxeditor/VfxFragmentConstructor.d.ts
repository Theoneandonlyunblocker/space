import {VfxFragment} from "modules/space/src/battlevfx/drawingfunctions/vfxfragments/VfxFragment";

interface Constructor<T>
{
  new (...args: any[]): T;
}
type VfxFragmentConstructorFunction = Constructor<VfxFragment<any>>;

export declare interface VfxFragmentConstructor
{
  key: string;
  displayName: string;
  constructorFN: VfxFragmentConstructorFunction;
}
