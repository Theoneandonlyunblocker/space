import {PropInfo} from "./PropInfo";


// TODO 2018.12.07 | move base vfxfragment stuff somewhere else
export abstract class Primitive<T> extends PropInfo<T>
{
  public copyValue(value: T): T
  {
    return value;
  }
}

export abstract class ShallowObject<T extends {[key: string]: any}> extends PropInfo<T>
{
  public copyValue(value: T): T
  {
    return {...value};
  }
}

export abstract class Clonable<T extends {clone(): T}> extends PropInfo<T>
{
  public copyValue(value: T): T
  {
    return value.clone();
  }
}
