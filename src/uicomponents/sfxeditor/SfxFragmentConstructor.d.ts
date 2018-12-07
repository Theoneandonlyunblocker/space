import SfxFragment from "../../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

interface Constructor<T>
{
  new (...args: any[]): T;
}
type SfxFragmentConstructorFunction = Constructor<SfxFragment<any>>;

declare interface SfxFragmentConstructor
{
  key: string;
  displayName: string;
  constructorFN: SfxFragmentConstructorFunction;
}

export default SfxFragmentConstructor;
