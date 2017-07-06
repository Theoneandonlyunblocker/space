/// <reference path="../../../lib/react-global.d.ts" />

import MixinBase from "./MixinBase";

import Point from "../../Point";
import {Rect} from "../../Rect";
import
{
  recursiveRemoveAttribute,
  shallowCopy,
} from "../../utility";
import NormalizedEvent from "./NormalizedEvent";
import normalizeEvent from "./normalizeEvent";

export interface DragPositionerProps
{
  containerElement?: HTMLElement | React.Component<any, any>;
  // doesn't start dragging unless event target has class "draggable"
  startOnHandleElementOnly?: boolean;
  forcedDragOffset?: Point;
  dragThreshhold?: number;
  preventAutoResize?: boolean;
  shouldMakeClone?: boolean;
}

export default class DragPositioner<T extends React.Component<any, any>> implements MixinBase<T>
{
  public isDragging: boolean = false;

  public containerElementDescriptor: HTMLElement | React.Component<any, any>;
  public startOnHandleElementOnly: boolean = false;
  public forcedDragOffset: Point;
  public dragThreshhold: number = 5;
  public preventAutoResize: boolean = false;
  public shouldMakeClone: boolean = false;

  public makeDragClone: () => HTMLElement;
  public onDragStart: (x?: number, y?: number) => void;
  public onDragMove: (x: number, y: number) => void;
  public onDragEnd: () => boolean | void; // return value: was drop succesful

  public position: Rect =
  {
    left: undefined,
    top: undefined,
    width: undefined,
    height: undefined,
  };
  public originPosition: Point = {x: 0, y: 0};
  public containerElement: HTMLElement; // set in componentDidMount


  private owner: T;

  private mouseIsDown: boolean = false;
  private dragOffset: Point = {x: 0, y: 0};
  private mouseDownPosition: Point = {x: 0, y: 0};

  private cloneElement: HTMLElement = null;

  private ownerDOMNode: HTMLElement;
  private containerRect: ClientRect;
  private touchEventTarget: HTMLElement;
  private needsFirstTouchUpdate: boolean;
  private ownerIsMounted: boolean = false;

  constructor(owner: T, props?: DragPositionerProps)
  {
    this.owner = owner;
    if (props)
    {
      const propKeysMap =
      {
        containerElement: "containerElementDescriptor",
      };
      for (let key in props)
      {
        if (propKeysMap[key])
        {
          this[propKeysMap[key]] = props[key];
        }
        else
        {
          this[key] = props[key];
        }
      }
    }

    this.setContainerRect = this.setContainerRect.bind(this);

    this.handleNativeMoveEvent = this.handleNativeMoveEvent.bind(this);
    this.handleNativeUpEvent = this.handleNativeUpEvent.bind(this);
    this.handleReactDownEvent = this.handleReactDownEvent.bind(this);
  }

  public componentDidMount()
  {
    this.ownerIsMounted = true;
    this.ownerDOMNode = ReactDOM.findDOMNode<HTMLElement>(this.owner);
    if (this.containerElementDescriptor)
    {
      if (this.containerElementDescriptor instanceof React.Component)
      {
        // React element
        this.containerElement = ReactDOM.findDOMNode<HTMLElement>(this.containerElementDescriptor);
      }
      // DOM node
      else
      {
        this.containerElement = <HTMLElement>this.containerElementDescriptor;
      }
    }
    else
    {
      this.containerElement = document.body;
    }

    this.setContainerRect();
    window.addEventListener("resize", this.setContainerRect, false);
  }
  public componentWillUnmount()
  {
    this.ownerIsMounted = false;
    this.removeEventListeners();
    window.removeEventListener("resize", this.setContainerRect);
  }
  // public onRender()
  // {
  //   // do we need to update clone position here? some components used to, but
  //   // it gets updated in this.handleDrag() anyway
  // }
  public getStyleAttributes(): React.CSSProperties
  {
    return shallowCopy(this.position);
  }
  public handleReactDownEvent(e: React.MouseEvent | React.TouchEvent)
  {
    this.handleMouseDown(normalizeEvent(e));
  }
  public updateDOMNodeStyle()
  {
    let s: CSSStyleDeclaration;
    if (this.cloneElement)
    {
      s = this.cloneElement.style;
    }
    else
    {
      s = this.ownerDOMNode.style;
      // should we check this.preventAutoResize here?
      s.width = "" + this.position.width + "px";
      s.height = "" + this.position.height + "px";
    }

    s.left = "" + this.position.left + "px";
    s.top = "" + this.position.top + "px";
  }

  private handleMouseDown(e: NormalizedEvent)
  {
    if (e.button)
    {
      return;
    }
    if (this.startOnHandleElementOnly)
    {
      if (!e.target.classList.contains("draggable-container"))
      {
        return;
      }
    }

    e.preventDefault();
    e.stopPropagation();

    if (this.isDragging)
    {
      return;
    }

    const clientRect = this.ownerDOMNode.getBoundingClientRect();

    if (e.wasTouchEvent)
    {
      this.needsFirstTouchUpdate = true;
      this.touchEventTarget = <HTMLElement> e.target;
    }

    this.addEventListeners();

    this.dragOffset = this.forcedDragOffset ||
    {
      x: e.clientX - clientRect.left,
      y: e.clientY - clientRect.top,
    };

    this.mouseIsDown = true;
    this.mouseDownPosition =
    {
      x: e.pageX,
      y: e.pageY,
    };
    this.originPosition =
    {
      x: clientRect.left + document.body.scrollLeft,
      y: clientRect.top + document.body.scrollTop,
    };

    if (this.dragThreshhold <= 0)
    {
      this.handleMouseMove(e);
    }
  }
  private handleMouseMove(e: NormalizedEvent)
  {
    e.preventDefault();

    if (e.clientX === 0 && e.clientY === 0)
    {
      return;
    }

    if (!this.isDragging)
    {
      const deltaX = Math.abs(e.pageX - this.mouseDownPosition.x);
      const deltaY = Math.abs(e.pageY - this.mouseDownPosition.y);

      const delta = deltaX + deltaY;

      if (delta >= this.dragThreshhold)
      {
        this.isDragging = true;
        if (!this.preventAutoResize)
        {
          this.position.width = this.ownerDOMNode.offsetWidth;
          this.position.height = this.ownerDOMNode.offsetHeight;
        }

        if (this.shouldMakeClone || this.makeDragClone)
        {
          if (!this.makeDragClone)
          {
            const nextSibling = this.ownerDOMNode.nextSibling;
            const clone = <HTMLElement> this.ownerDOMNode.cloneNode(true);
            recursiveRemoveAttribute(clone, "data-reactid");

            this.ownerDOMNode.parentNode.insertBefore(clone, nextSibling);
            this.cloneElement = clone;
          }
          else
          {
            const clone = this.makeDragClone();
            recursiveRemoveAttribute(clone, "data-reactid");
            document.body.appendChild(clone);
            this.cloneElement = clone;
          }
        }

        const x = e.pageX - this.dragOffset.x;
        const y = e.pageY - this.dragOffset.y;

        this.owner.forceUpdate();

        if (this.onDragStart)
        {
          this.onDragStart(x, y);
        }
        // TODO 04.07.2017 | can't we delete this? called below in this.handleDrag()
        if (this.onDragMove)
        {
          this.onDragMove(x, y);
        }
      }
    }

    if (this.isDragging)
    {
      this.handleDrag(e);
    }
  }
  private handleDrag(e: NormalizedEvent)
  {
    let domWidth: number;
    let domHeight: number;

    if (this.makeDragClone)
    {
      domWidth = this.cloneElement.offsetWidth;
      domHeight = this.cloneElement.offsetHeight;
    }
    else
    {
      domWidth = this.ownerDOMNode.offsetWidth;
      domHeight = this.ownerDOMNode.offsetHeight;
    }

    const minX = this.containerRect.left;
    const maxX = this.containerRect.right;
    const minY = this.containerRect.top;
    const maxY = this.containerRect.bottom;

    let x = e.pageX - this.dragOffset.x;
    let y = e.pageY - this.dragOffset.y;

    const x2 = x + domWidth;
    const y2 = y + domHeight;

    if (x < minX)
    {
      x = minX;
    }
    else if (x2 > maxX)
    {
      x = maxX- domWidth;
    }

    if (y < minY)
    {
      y = minY;
    }
    else if (y2 > maxY)
    {
      y = maxY - domHeight;
    }

    if (this.onDragMove)
    {
      this.onDragMove(x, y);
    }
    else
    {
      this.position.left = x;
      this.position.top = y;
      this.updateDOMNodeStyle();
    }
  }
  private handleMouseUp(e: NormalizedEvent)
  {
    // if (this.touchEventTarget)
    // {
    //   const touch = e.changedTouches[0];

    //   const dropTarget = getDropTargetAtLocation(touch.clientX, touch.clientY);
    //   console.log(dropTarget);
    //   if (dropTarget)
    //   {
    //     const reactid = dropTarget.getAttribute("data-reactid");
    //     eventManager.dispatchEvent("drop" + reactid);
    //   }
    // }

    e.stopPropagation();
    e.preventDefault();

    this.mouseIsDown = false;
    this.mouseDownPosition =
    {
      x: 0,
      y: 0,
    };

    if (this.isDragging)
    {
      this.handleDragEnd(e);
    }

    this.removeEventListeners();
  }
  private handleDragEnd(e: NormalizedEvent)
  {
    if (this.cloneElement)
    {
      this.cloneElement.parentNode.removeChild(this.cloneElement);
      this.cloneElement = null;
    }

    this.isDragging = false;
    this.dragOffset = {x: 0, y: 0};
    this.originPosition = {x: 0, y: 0};

    if (this.onDragEnd)
    {
      this.onDragEnd();
    }

    if (this.ownerIsMounted)
    {
      this.owner.forceUpdate();
    }
  }
  private setContainerRect()
  {
    this.containerRect = this.containerElement.getBoundingClientRect();
  }
  private handleNativeMoveEvent(e: MouseEvent | TouchEvent)
  {
    this.handleMouseMove(normalizeEvent(e));
  }
  private handleNativeUpEvent(e: MouseEvent | TouchEvent)
  {
    this.handleMouseUp(normalizeEvent(e));
  }
  private addEventListeners()
  {
    this.containerElement.addEventListener("mousemove", this.handleNativeMoveEvent);
    document.addEventListener("mouseup", this.handleNativeUpEvent);

    if (this.touchEventTarget)
    {
      this.touchEventTarget.addEventListener("touchmove", this.handleNativeMoveEvent);
      this.touchEventTarget.addEventListener("touchend", this.handleNativeUpEvent);
    }
  }
  private removeEventListeners()
  {
    this.containerElement.removeEventListener("mousemove", this.handleNativeMoveEvent);
    document.removeEventListener("mouseup", this.handleNativeUpEvent);

    if (this.touchEventTarget)
    {
      this.touchEventTarget.removeEventListener("touchmove", this.handleNativeMoveEvent);
      this.touchEventTarget.removeEventListener("touchend", this.handleNativeUpEvent);
      this.touchEventTarget = null;
    }
  }
}
