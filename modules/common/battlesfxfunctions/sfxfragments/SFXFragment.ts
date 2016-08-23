/// <reference path="../../../../lib/pixi.d.ts" />

import SFXFragmentPropTypes from "./SFXFragmentPropTypes";
import
{
  shallowExtend
} from "../../../../src/utility";

let idGenerator = 0;

abstract class SFXFragment<P extends PartialProps, PartialProps>
{
  public id: number;
  
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
      const parent = oldDisplayObject.parent;
      if (parent)
      {
        const childIndex = parent.getChildIndex(oldDisplayObject);
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
  public setPosition(pos: Point)
  {
    this.displayObject.position.set(pos.x, pos.y);
  }
  public get scale(): Point
  {
    return this.displayObject.scale;
  }
  public set scale(scale: Point)
  {
    this.displayObject.scale.set(scale.x, scale.y);
  }

  public propTypes: SFXFragmentPropTypes;
  public readonly defaultProps: P;
  public readonly props: P;

  constructor(propTypes: SFXFragmentPropTypes, defaultProps: P, props?: PartialProps)
  {
    this.id = idGenerator++;

    this.propTypes = propTypes;
    this.defaultProps = defaultProps;

    this.props = shallowExtend(defaultProps, <P>props);
  }

  public abstract animate(relativeTime: number): void;
  public abstract draw(): void;

  public setProps(props: PartialProps): void
  {
    this.assignPartialProps(props);
    this.draw();
  }
  
  private assignPartialProps(props: PartialProps): void
  {
    for (let prop in props)
    {
      this.props[prop] = props[prop];
    }
  }
}

export default SFXFragment;
