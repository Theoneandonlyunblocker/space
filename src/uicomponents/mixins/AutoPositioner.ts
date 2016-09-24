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

    let ySide = this.props.ySide || "top";
    let xSide = this.props.xSide || "right";

    const yMargin = this.props.yMargin || 0;
    const xMargin = this.props.xMargin || 0;

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

    if (left < 0)
    {
      left = 0;
    }
    else if (left + ownRect.width > window.innerWidth)
    {
      left = left - (left + ownRect.width - window.innerWidth)
    }

    if (top < 0)
    {
      top = 0;
    }
    else if (top + ownRect.height > window.innerHeight)
    {
      top = top - (top + ownRect.height - window.innerHeight)
    }

    ownNode.style.left = "" + left + "px";
    ownNode.style.top = "" + top + "px";
  }
}
