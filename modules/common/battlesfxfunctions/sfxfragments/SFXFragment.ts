/// <reference path="../../../../lib/pixi.d.ts" />

import SFXFragmentPropTypes from "./SFXFragmentPropTypes";


abstract class SFXFragment<P extends PartialProps, PartialProps>
{
  protected _displayObject: PIXI.DisplayObject;
  public get displayObject(): PIXI.DisplayObject
  {
    return this._displayObject;
  }
  protected setDisplayObject(newDisplayObject: PIXI.DisplayObject): void
  {
    const oldDisplayObject = this.displayObject; 
    const parent = oldDisplayObject.parent;
    if (parent)
    {
      const childIndex = parent.getChildIndex(oldDisplayObject);
      parent.removeChildAt(childIndex);
      parent.addChildAt(newDisplayObject, childIndex);
    }

    this._displayObject = newDisplayObject;
  }

  public get bounds(): PIXI.Rectangle
  {
    return this.displayObject.getBounds();
  }
  public get position(): Point
  {
    return this.displayObject.position;
  }
  public set position(pos: Point)
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
  public readonly props: P;

  constructor(propTypes: SFXFragmentPropTypes, props?: PartialProps)
  {
    this.propTypes = propTypes;

    this.props = this.getDefaultProps();
    
    if (props)
    {
      this.assignPartialProps(props);
    }
  }

  public abstract animate(relativeTime: number): void;
  public abstract draw(): void;

  public setProps(props: PartialProps): void
  {
    this.assignPartialProps(props);
    this.draw();
  }
  public getDefaultProps(): P
  {
    const props: PartialProps = <PartialProps>{};

    for (let prop in this.propTypes)
    {
      props[prop] = this.propTypes[prop].defaultValue;
    }

    return <P>props;
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
