/// <reference path="../../../lib/react-global-0.13.3.d.ts" />
import * as React from "react/addons";

import MixinBase from "./MixinBase";

import Point from "../../Point";
import {recursiveRemoveAttribute} from "../../utility";

// TODO performance | performance might be pretty bad
// we should be able to use native event and fetch some flags
// using methods like wasTouchEvent(e) & didHaveButtonPressed(e)
interface NormalizedEvent
{
  wasTouchEvent: boolean;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  target: HTMLElement;
  
  button: number;
  
  preventDefault: () => void;
  stopPropagation: () => void;
}

function normalizeMouseEvent(nativeEvent: MouseEvent, reactEvent?: React.MouseEvent): NormalizedEvent
{
  return(
  {
    wasTouchEvent: false,
    clientX: nativeEvent.clientX,
    clientY: nativeEvent.clientY,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    target: <HTMLElement> nativeEvent.target,
    
    button: nativeEvent.button,
    
    preventDefault: (reactEvent ?
      reactEvent.preventDefault.bind(reactEvent) :
      nativeEvent.preventDefault.bind(nativeEvent)),
    stopPropagation: (reactEvent ?
      reactEvent.stopPropagation.bind(reactEvent) :
      nativeEvent.stopPropagation.bind(nativeEvent)),
  })
}
function normalizeTouchEvent(nativeEvent: TouchEvent, reactEvent?: React.TouchEvent): NormalizedEvent
{
  const touch: Touch = nativeEvent.touches[0];
  
  return(
  {
    wasTouchEvent: true,
    clientX: touch.clientX,
    clientY: touch.clientY,
    pageX: touch.pageX,
    pageY: touch.pageY,
    target: <HTMLElement> touch.target,
    
    button: -1,
    
    preventDefault: (reactEvent ?
      reactEvent.preventDefault.bind(reactEvent) :
      nativeEvent.preventDefault.bind(nativeEvent)),
    stopPropagation: (reactEvent ?
      reactEvent.stopPropagation.bind(reactEvent) :
      nativeEvent.stopPropagation.bind(nativeEvent)),
  })
}

function normalizeEvent(sourceEvent: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): NormalizedEvent
{
  const castedEvent = <any> sourceEvent;
  const isReactEvent = Boolean(castedEvent.nativeEvent);
  const isTouchEvent = Boolean(castedEvent.touches);
  
  if (isTouchEvent)
  {
    if (isReactEvent)
    {
      return normalizeTouchEvent(<TouchEvent> castedEvent.nativeEvent, castedEvent)
    }
    else
    {
      return normalizeTouchEvent(<TouchEvent> sourceEvent);
    }
  }
  else
  {
    if (isReactEvent)
    {
      return normalizeMouseEvent(<MouseEvent> castedEvent.nativeEvent, castedEvent)
    }
    else
    {
      return normalizeMouseEvent(<MouseEvent> sourceEvent);
    }
  }
}

export interface DragPositionerProps
{
  containerElement?: HTMLElement | React.Component<any, any>;
  containerDragOnly?: boolean
  forcedDragOffset?: Point;
  dragThreshhold?: number;
  preventAutoResize?: boolean;
  makeClone?: boolean;
}

const emptyProps: DragPositionerProps = {};

export default class DragPositioner<T extends React.Component<any, any>> implements MixinBase<T>
{
  public dragPos: Point = {x: 0, y: 0};
  public dragSize: Point = {x: 0, y: 0};
  public mouseIsDown: boolean = false;
  public dragOffset: Point = {x: 0, y: 0};
  public mouseDownPosition: Point = {x: 0, y: 0};
  public originPosition: Point = {x: 0, y: 0};
  
  public isDragging: boolean = false;
  public cloneElement: HTMLElement = null;
  
  public makeDragClone: () => HTMLElement;
  public onDragStart: () => void;
  public onDragMove: (x: number, y: number) => void;
  public onDragEnd: () => boolean | void; // return value: was drop succesful
  
  
  private owner: T;
  private get props(): DragPositionerProps
  {
    return this.owner.props.dragPositionerProps || emptyProps;
  }
  
  private ownerDOMNode: HTMLElement;
  private containerElement: HTMLElement;
  private containerRect: ClientRect;
  private touchEventTarget: HTMLElement;
  private needsFirstTouchUpdate: boolean;
  
  
  constructor(owner: T)
  {
    this.owner = owner;
    
    this.setContainerRect = this.setContainerRect.bind(this);
    
    this.handleNativeMoveEvent = this.handleNativeMoveEvent.bind(this);
    this.handleNativeUpEvent = this.handleNativeUpEvent.bind(this);
    this.handleReactDownEvent = this.handleReactDownEvent.bind(this);
  }
  
  public componentDidMount()
  {
    this.ownerDOMNode = React.findDOMNode<HTMLElement>(this.owner);
    if (this.props.containerElement)
    {
      if (React.isValidElement(this.props.containerElement))
      {
        // React element
        this.containerElement = React.findDOMNode<HTMLElement>(this.props.containerElement);
      }
      // DOM node
      else
      {
        this.containerElement = <HTMLElement>this.props.containerElement;
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
    return(
    {
      top: this.dragPos.y,
      left: this.dragPos.x,
      width: this.dragSize.x,
      height: this.dragSize.y
    });
  }
  public handleReactDownEvent(e: React.MouseEvent | React.TouchEvent)
  {
    this.handleMouseDown(normalizeEvent(e));
  }
  
  private handleMouseDown(e: NormalizedEvent)
  {
    if (e.button)
    {
      return;
    }
    if (this.props.containerDragOnly)
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

    this.dragOffset = this.props.forcedDragOffset ||
    {
      x: e.clientX - clientRect.left,
      y: e.clientY - clientRect.top
    };

    this.mouseIsDown = true;
    this.mouseDownPosition =
    {
      x: e.pageX,
      y: e.pageY
    };
    this.originPosition =
    {
      x: clientRect.left + document.body.scrollLeft,
      y: clientRect.top + document.body.scrollTop
    }

    if (this.props.dragThreshhold <= 0)
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

      const threshhold = isFinite(this.props.dragThreshhold) ? this.props.dragThreshhold : 5;
      if (delta >= threshhold)
      {
        this.isDragging = true;
        if (!this.props.preventAutoResize)
        {
          this.dragSize.x = this.ownerDOMNode.offsetWidth;
          this.dragSize.y = this.ownerDOMNode.offsetHeight;
        }

        if (this.props.makeClone || this.makeDragClone)
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
            document.body.appendChild(clone);
            this.cloneElement = clone;
          }
        }

        this.owner.forceUpdate();

        if (this.onDragStart)
        {
          this.onDragStart();
        }
        if (this.onDragMove)
        {
          this.onDragMove(e.pageX - this.dragOffset.x, e.pageY - this.dragOffset.y);
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
      x = this.containerRect.width - domWidth;
    };

    if (y < minY)
    {
      y = minY;
    }
    else if (y2 > maxY)
    {
      y = this.containerRect.height - domHeight;
    };

    if (this.onDragMove)
    {
      this.onDragMove(x, y);
    }
    else
    {
      this.dragPos.x = x;
      this.dragPos.y = y;
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


    this.mouseIsDown = false;
    this.mouseDownPosition =
    {
      x: 0,
      y: 0
    }

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
      const endSuccesful = this.onDragEnd();
    }
    
    this.owner.forceUpdate();
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
  private updateDOMNodeStyle()
  {
    let s: CSSStyleDeclaration;
    if (this.cloneElement)
    {
      s = this.cloneElement.style;
    }
    else
    {
      s = this.ownerDOMNode.style;
      s.width = "" + this.dragSize.x + "px";
      s.height = "" + this.dragSize.y + "px";
    }
    
    s.left = "" + this.dragPos.x + "px";
    s.top = "" + this.dragPos.y + "px";
  }
}
