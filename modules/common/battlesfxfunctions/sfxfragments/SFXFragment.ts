/// <reference path="../../../../lib/pixi.d.ts" />

import {SFXFragmentPropType} from "./SFXFragmentPropTypes";
import
{
  shallowCopy
} from "../../../../src/utility";

let idGenerator = 0;

abstract class SFXFragment<P>
{
  public id: number;
  public abstract key: string;
  public abstract displayName: string;

  // public propTypes: SFXFragmentPropTypes;
  public propTypes: {[K in keyof P]: SFXFragmentPropType}
  private readonly defaultProps: P;
  public readonly props: P;


  protected _displayObject: PIXI.DisplayObject;
  public get displayObject(): PIXI.DisplayObject
  {
    return this._displayObject;
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
  constructor(propTypes: SFXFragmentPropTypes, defaultProps: P, props?: Partial<P>)
  {
    this.id = idGenerator++;

    this.propTypes = propTypes;
    this.defaultProps = defaultProps;

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
    this.setProps(this.defaultProps);
  }

  private setProps(props: Partial<P>): void
  {
    for (let prop in props)
    {
      const propType = this.propTypes[prop];
      switch (propType)
      {
        case "number":
        case "boolean":
        {
          this.props[prop] = props[prop];
          break;
        };
        case "point":
        case "range":
        {
          this.props[prop] = shallowCopy(props[prop]);
          break;
        }
        case "color":
        case "rampingValue":
        {
          this.props[prop] = props[prop].clone();
          break;
        }
        default:
        {
          this.props[prop] = props[prop];
          console.warn(`Unrecognized sfx fragment prop type ${this.key}.${prop}: ${propType}`);
          break;
        }
      }
    }
  }
}

export default SFXFragment;
