import * as PIXI from "pixi.js";

import {PropInfo} from "./props/PropInfo";
import {Point} from "core/src/math/Point";
import { linearStep } from "core/src/generic/utility";


let idGenerator = 0;

export abstract class VfxFragment<P, D extends PIXI.DisplayObject = PIXI.DisplayObject>
{
  public id: number;
  public abstract key: string;
  public abstract displayName: string;

  public abstract readonly propInfo:
  {
    [K in keyof Required<P>]: PropInfo<P[K]>;
  };
  public readonly props: P = <P> {};


  protected _displayObject: D;
  public get displayObject(): D
  {
    return this._displayObject;
  }

  public get bounds(): PIXI.Rectangle
  {
    return this.displayObject.getBounds();
  }
  public get position(): PIXI.Point | PIXI.ObservablePoint
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
  /**
   * make sure to call this.initializeProps(initialProps) in derived constructor
   */
  constructor()
  {
    this.id = idGenerator++;
  }

  public abstract animate(relativeTime: number): void;
  public abstract draw(...args: any[]): void;

  public animateWithinTimeSpan(time: number, start: number, end: number): void
  {
    const timeRelativeToTimeSpan = linearStep(time, start, end);

    this.animate(timeRelativeToTimeSpan);
  }
  public setCenter(x: number, y: number): void
  {
    const bounds = this.displayObject.getBounds();
    this.position.set(
      x - bounds.width / 2,
      y - bounds.height / 2,
    );
  }
  public setDefaultProps(providedProps: Partial<P> = {}): void
  {
    for (const key in this.propInfo)
    {
      if (providedProps[key] !== undefined)
      {
        this.props[key] = this.propInfo[key].copyValue(providedProps[key]);
      }
      else
      {
        this.props[key] = this.propInfo[key].getDefaultValue();
      }
    }
  }

  // not done in constructor as we want derived class parameter initialization to be done first
  protected initializeProps(initialValues?: Partial<P>): void
  {
    this.setDefaultProps(initialValues);
  }
  protected setDisplayObject(newDisplayObject: D): void
  {
    const oldDisplayObject = this.displayObject;
    if (oldDisplayObject)
    {
      newDisplayObject.position.copyFrom(oldDisplayObject.position);

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
}
