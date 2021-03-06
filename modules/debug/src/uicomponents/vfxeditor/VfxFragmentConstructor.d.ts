import {VfxFragment} from "modules/baselib/src/combat/vfx/fragments/VfxFragment";

interface Constructor<T>
{
  // tslint:disable-next-line: callable-types
  new (...args: any[]): T;
}
type VfxFragmentConstructorFunction = Constructor<VfxFragment<any>>;

export declare interface VfxFragmentConstructor
{
  key: string;
  displayName: string;
  constructorFN: VfxFragmentConstructorFunction;
}
