import {PropInfoType} from "./PropInfoType";

export abstract class PropInfo<T>
{
  // should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/14600
  public abstract readonly type: PropInfoType;

  private readonly defaultValue: T;

  constructor(defaultValue: T)
  {
    this.defaultValue = defaultValue;
  }

  public abstract copyValue(value: T): T;
  public getDefaultValue(): T
  {
    return this.copyValue(this.defaultValue);
  }
}
