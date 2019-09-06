import
{
  shallowCopy,
} from "src/generic/utility";

import {PropInfo} from "./PropInfo";


// TODO 2018.12.07 | move base vfxfragment stuff somewhere else
export abstract class Primitive<T> extends PropInfo<T>
{
  public copyValue(value: T): T
  {
    return value;
  }
}

export abstract class ShallowObject<T> extends PropInfo<T>
{
  public copyValue(value: T): T
  {
    return shallowCopy(value);
  }
}

export abstract class Clonable<T extends {clone(): T}> extends PropInfo<T>
{
  public copyValue(value: T): T
  {
    return value.clone();
  }
}
