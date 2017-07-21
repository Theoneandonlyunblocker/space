import * as React from "react";
import * as ReactDOM from "react-dom";

import MixinBase from "./MixinBase";

export interface AutoPositionerProps
{
  getParentClientRect: () => ClientRect;
  xSide?: "innerRight" | "outerRight" | "innerLeft" | "outerLeft";
  ySide?: "innerTop" | "outerTop" | "innerBottom" | "outerBottom";

  xMargin?: number;
  yMargin?: number;
  positionOnUpdate?: boolean;
  positionOnResize?: boolean;
}

export default class AutoPositioner<T extends React.Component<any, any>> implements MixinBase<T>
{
  private owner: T;
  private get props(): AutoPositionerProps
  {
    return this.owner.props.autoPositionerProps;
  }
  private hasResizeListener: boolean = false;

  constructor(owner: T)
  {
    this.owner = owner;

    this.setAutoPosition = this.setAutoPosition.bind(this);
  }

  public componentDidMount()
  {
    this.setAutoPosition();
    if (this.props.positionOnResize)
    {
      window.addEventListener("resize", this.setAutoPosition, false);
      this.hasResizeListener = true;
    }
  }
  public componentWillUnmount()
  {
    if (this.hasResizeListener)
    {
      window.removeEventListener("resize", this.setAutoPosition);
    }
  }
  public componentDidUpdate()
  {
    if (this.props.positionOnUpdate)
    {
      this.setAutoPosition();
    }
  }

  // not currently used
  // private static flipSide(side: side): side
  // {
  //   switch (side)
  //   {
  //     case "top":
  //     {
  //       return "bottom";
  //     }
  //     case "bottom":
  //     {
  //       return "top";
  //     }
  //     case "left":
  //     {
  //       return "right";
  //     }
  //     case "right":
  //     {
  //       return "left";
  //     }
  //     default:
  //     {
  //       throw new Error("Invalid side");
  //     }
  //   }
  // }
  // not currently used
  // private static elementFitsYSide(side: side, ownRect: ClientRect, parentRect: ClientRect)
  // {
  //   switch (side)
  //   {
  //     case "top":
  //     {
  //       return parentRect.top - ownRect.height >= 0;
  //     }
  //     case "bottom":
  //     {
  //       return parentRect.bottom + ownRect.height < window.innerHeight;
  //     }
  //     default:
  //     {
  //       throw new Error("Invalid side");
  //     }
  //   }
  // }
  // not currently used
  // private static elementFitsXSide(side: side, ownRect: ClientRect, parentRect: ClientRect)
  // {
  //   switch (side)
  //   {
  //     case "left":
  //     {
  //       return parentRect.left + ownRect.width < window.innerWidth;
  //     }
  //     case "right":
  //     {
  //       return parentRect.right - ownRect.width >= 0;
  //     }
  //     default:
  //     {
  //       throw new Error("Invalid side");
  //     }
  //   }
  // }
  private setAutoPosition()
  {
    const parentRect = this.props.getParentClientRect();
    const ownNode = ReactDOM.findDOMNode<HTMLElement>(this.owner);
    const ownRect = ownNode.getBoundingClientRect();

    const ySide = this.props.ySide;
    const xSide = this.props.xSide;

    const yMargin = this.props.yMargin || 0;
    const xMargin = this.props.xMargin || 0;

    let top: number = null;
    let left: number = null;

    switch (ySide)
    {
      case "outerTop":
      {
        top = parentRect.top - ownRect.height - yMargin;
        break;
      }
      case "outerBottom":
      {
        top = parentRect.bottom + yMargin;
        break;
      }
      case "innerTop":
      {
        top = parentRect.top + yMargin;
        break;
      }
      case "innerBottom":
      {
        top = parentRect.bottom - ownRect.height - yMargin;
        break;
      }
    }
    switch (xSide)
    {
      case "outerLeft":
      {
        left = parentRect.left - ownRect.width - xMargin;
        break;
      }
      case "outerRight":
      {
        left = parentRect.right + xMargin;
        break;
      }
      case "innerLeft":
      {
        left = parentRect.left + xMargin;
        break;
      }
      case "innerRight":
      {
        left = parentRect.right - ownRect.width - xMargin;
        break;
      }
    }

    if (left < 0)
    {
      left = 0;
    }
    else if (left + ownRect.width > window.innerWidth)
    {
      left = left - (left + ownRect.width - window.innerWidth);
    }

    if (top < 0)
    {
      top = 0;
    }
    else if (top + ownRect.height > window.innerHeight)
    {
      top = top - (top + ownRect.height - window.innerHeight);
    }

    ownNode.style.left = "" + left + "px";
    ownNode.style.top = "" + top + "px";
  }
}
