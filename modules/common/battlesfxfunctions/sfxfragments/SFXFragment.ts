/// <reference path="../../../../lib/pixi.d.ts" />

import {PropInfo} from "./props/PropInfo";

let idGenerator = 0;

abstract class SFXFragment<P>
{
  public id: number;
  public abstract key: string;
  public abstract displayName: string;

  public abstract readonly propInfo:
  {
    [K in keyof P]: PropInfo<any>;
  };
  public readonly props: P;


  protected _displayObject: PIXI.DisplayObject;
  public get displayObject(): PIXI.DisplayObject
  {
    return this._displayObject;
  }

  public get bounds(): PIXI.Rectangle
  {
    return this.displayObject.getBounds();
  }
  public get position(): PIXI.Point
  {
    return this.displayObject.position;
  }
  public get scale(): Point
  {
    return this.displayObject.scale;
  }
  public set scale(scale: Point)
  {
    this.displayObject.scale.set(scale.x, scale.y);
  }
  constructor(propInfo: {[K in keyof P]: PropInfo<any>}, props?: Partial<P>)
  {
    this.id = idGenerator++;

    this.propInfo = propInfo;

    this.props = <P> {};
    this.setDefaultProps();
    if (props)
    {
      this.setProps(props);
    }
  }

  public abstract animate(relativeTime: number): void;
  public abstract draw(...args: any[]): void;

  public setDefaultProps(): void
  {
    for (let key in this.propInfo)
    {
      this.props[key] = this.propInfo[key].getDefaultValue();
    }
  }

  protected setDisplayObject(newDisplayObject: PIXI.DisplayObject): void
  {
    const oldDisplayObject = this.displayObject;
    if (oldDisplayObject)
    {
      newDisplayObject.position = oldDisplayObject.position.clone();

      const parent = oldDisplayObject.parent;
      if (parent)
      {
        const childIndex = parent.children.indexOf(oldDisplayObject);
        parent.removeChildAt(childIndex);
        parent.addChildAt(newDisplayObject, childIndex);
      }
    }

    this._displayObject = newDisplayObject;
  }

  private setProps(props: Partial<P>): void
  {
    for (let key in props)
    {
      this.props[key] = this.propInfo[key].copyValue(props[key]);
    }
  }
}

export default SFXFragment;
