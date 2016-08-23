import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface Constructor<T>
{
  new (...args: any[]): T;
}
type SFXFragmentConstructorFunction = Constructor<SFXFragment<any, any>>;

declare interface SFXFragmentConstructor
{
  key: string;
  displayName: string;
  constructorFN: SFXFragmentConstructorFunction;
}

export default SFXFragmentConstructor;
