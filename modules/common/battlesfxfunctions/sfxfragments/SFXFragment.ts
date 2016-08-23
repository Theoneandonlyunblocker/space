/// <reference path="../../../../lib/pixi.d.ts" />

import SFXParams from "../../../../src/templateinterfaces/SFXParams";

import Point from "../../../../src/Point";

interface SFXFragmentNumberProp
{
  type: "number";
  min?: number;
  max?: number;
}
interface SFXFragmentPointProp
{
  type: "point";
  min?: Point;
  max?: Point;
}
interface SFXFragmentColorProp
{
  type: "color";
}

type SFXFragmentProp =
  SFXFragmentNumberProp |
  SFXFragmentPointProp |
  SFXFragmentColorProp;

interface SFXFragmentPropTypes
{
  [prop: string]: SFXFragmentProp;
}

abstract class SFXFragment<P extends PartialProps,
  PartialProps,
  PropTypes extends SFXFragmentPropTypes>
{
  private displayObject: PIXI.DisplayObject;

  public animate: (relativeTime: number) => void;
  private draw: () => void;

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

  public params: SFXParams;
  public propTypes: PropTypes;
  private _props: P;
  public get props(): PartialProps
  {
    return this._props;
  }
  public set props(props: PartialProps)
  {
    for (let prop in props)
    {
      this._props[prop] = props[prop];
    }

    this.draw();
  }

  constructor(propTypes: PropTypes, params?: SFXParams, props?: P)
  {
    this.propTypes = propTypes;
    if (params)
    {
      this.params = params;
    }
    if (props)
    {
      this._props = props;
    }
    if (params && props)
    {
      this.draw();
    }

  }

  public abstract getPropTypes(): PropTypes;

}

export default SFXFragment;
