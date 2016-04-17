/// <reference path="../../../lib/react-global.d.ts" />

import MixinBase from "./MixinBase";

type side = "top" | "right" | "bottom" | "left";

export interface AutoPositionerProps
{
  getParentClientRect: () => ClientRect;
  xSide?: side;
  ySide?: side;
  
  xMargin?: number;
  yMargin?: number;
  positionOnUpdate?: boolean;
}

export default class AutoPositioner<T extends React.Component<any, any>> implements MixinBase<T>
{
  private owner: T;
  private get props(): AutoPositionerProps
  {
    return this.owner.props.autoPositionerProps;
  }
  
  
  constructor(owner: T)
  {
    this.owner = owner;
  }
  
  public componentDidMount()
  {
    this.setAutoPosition();
  }
  public componentDidUpdate()
  {
    if (this.props.positionOnUpdate)
    {
      this.setAutoPosition();
    }
  }
  
  private static flipSide(side: side): side
  {
    switch (side)
    {
      case "top":
      {
        return "bottom";
      }
      case "bottom":
      {
        return "top";
      }
      case "left":
      {
        return "right";
      }
      case "right":
      {
        return "left";
      }
      default:
      {
        throw new Error("Invalid side");
      }
    }
  }
  private static elementFitsYSide(side: side, ownRect: ClientRect, parentRect: ClientRect)
  {
    switch (side)
    {
      case "top":
      {
        return parentRect.top - ownRect.height >= 0;
      }
      case "bottom":
      {
        return parentRect.bottom + ownRect.height < window.innerHeight;
      }
      default:
      {
        throw new Error("Invalid side");
      }
    }
  }
  private static elementFitsXSide(side: side, ownRect: ClientRect, parentRect: ClientRect)
  {
    switch (side)
    {
      case "left":
      {
        return parentRect.left + ownRect.width < window.innerWidth;
      }
      case "right":
      {
        return parentRect.right - ownRect.width >= 0;
      }
      default:
      {
        throw new Error("Invalid side");
      }
    }
  }
  private setAutoPosition()
  {
    /*
    try to fit prefered y
      flip if doesnt fit
    try to fit prefered x alignment
      flip if doesnt fit
     */
    const parentRect = this.props.getParentClientRect();
    const ownNode = React.findDOMNode<HTMLElement>(this.owner);
    const ownRect = ownNode.getBoundingClientRect();

    let ySide = this.props.ySide || "top";
    let xSide = this.props.xSide || "right";

    const yMargin = this.props.yMargin || 0;
    const xMargin = this.props.xMargin || 0;

    const fitsY = AutoPositioner.elementFitsYSide(ySide, ownRect, parentRect);
    if (!fitsY)
    {
      ySide = AutoPositioner.flipSide(ySide);
    }

    const fitsX = AutoPositioner.elementFitsXSide(xSide, ownRect, parentRect);
    if (!fitsX)
    {
      xSide = AutoPositioner.flipSide(xSide);
    }
    let top: number = null;
    let left: number = null;

    if (ySide === "top")
    {
      top = parentRect.top - ownRect.height - yMargin;
    }
    else
    {
      top = parentRect.bottom + yMargin;
    }

    if (xSide === "left")
    {
      left = parentRect.left - xMargin;
    }
    else
    {
      left = parentRect.right - ownRect.width + xMargin;
    }

    ownNode.style.left = "" + left + "px";
    ownNode.style.top = "" + top + "px";
  }
}
