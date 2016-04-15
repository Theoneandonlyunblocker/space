/// <reference path="../../../lib/react-global-0.13.3.d.ts" />
import * as React from "react/addons";

import MixinBase from "./MixinBase";

import Point from "../../Point";
import {recursiveRemoveAttribute} from "../../utility";

interface NormalizedEvent
{
  wasTouchEvent: boolean;
  originalEvent: Event;
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
    originalEvent: nativeEvent,
    clientX: nativeEvent.clientX,
    clientY: nativeEvent.clientY,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    target: <HTMLElement> nativeEvent.target,
    
    button: nativeEvent.button,
    
    preventDefault: (reactEvent ? reactEvent.preventDefault : nativeEvent.preventDefault),
    stopPropagation: (reactEvent ? reactEvent.stopPropagation : nativeEvent.stopPropagation),
  })
}
function normalizeTouchEvent(nativeEvent: TouchEvent, reactEvent?: React.TouchEvent): NormalizedEvent
{
  const touch: Touch = nativeEvent.touches[0];
  
  return(
  {
    wasTouchEvent: true,
    originalEvent: nativeEvent,
    clientX: touch.clientX,
    clientY: touch.clientY,
    pageX: touch.pageX,
    pageY: touch.pageY,
    target: <HTMLElement> touch.target,
    
    button: -1,
    
    preventDefault: (reactEvent ? reactEvent.preventDefault : nativeEvent.preventDefault),
    stopPropagation: (reactEvent ? reactEvent.stopPropagation : nativeEvent.stopPropagation),
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
  public dragPos: Point;
  public dragSize: Point;
  public mouseIsDown: boolean = false;
  public dragOffset: Point = {x: 0, y: 0};
  public mouseDownPosition: Point = {x: 0, y: 0};
  public originPosition: Point = {x: 0, y: 0};
  
  public isDragging: boolean = false;
  public cloneElement: HTMLElement = null;
  
  public makeDragClone: () => HTMLElement;
  public onDragStart: (e: MouseEvent) => void;
  public onDragMove: (x: number, y: number) => void;
  public onDragEnd: (e: MouseEvent) => boolean; // return value: was drop succesful
  
  
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

  // }
  
  public handleMouseDown(originalEvent: React.MouseEvent | React.TouchEvent)
  {
    const originalTouchEvent = <React.TouchEvent> originalEvent;
    const originalMouseEvent = <React.MouseEvent> originalEvent;
    
    if (originalMouseEvent.button)
    {
      return;
    }
    if (this.props.containerDragOnly)
    {
      var target = <HTMLElement> originalEvent.target;
      if (!target.classList.contains("draggable-container"))
      {
        return;
      }
    }
    
    originalEvent.preventDefault();
    originalEvent.stopPropagation();

    if (this.isDragging)
    {
      return;
    }

    var clientRect = this.ownerDOMNode.getBoundingClientRect();

    let e: React.MouseEvent | Touch;
    if (isFinite(e.clientX))
    {
      e = <React.MouseEvent> originalEvent;
    }
    else
    {
      e = originalTouchEvent.touches[0];
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
  public handleMouseMove(e: MouseEvent | Touch)
  {
    const castedMouseEvent = <MouseEvent> e;
    if (castedMouseEvent.preventDefault)
    {
      castedMouseEvent.preventDefault();
    }

    // var e = e.clientX ? e : e.touches[0];


    if (e.clientX === 0 && e.clientY === 0)
    {
      return;
    }

    if (!this.isDragging)
    {
      var deltaX = Math.abs(e.pageX - this.mouseDownPosition.x);
      var deltaY = Math.abs(e.pageY - this.mouseDownPosition.y);

      var delta = deltaX + deltaY;


      if (delta >= this.props.dragThreshhold)
      {
        this.isDragging = true;
        if (!this.props.preventAutoResize)
        {
          this.dragSize.x = this.ownerDOMNode.offsetWidth;
          this.dragSize.y = this.ownerDOMNode.offsetHeight;
        }

        if (this.props.makeClone)
        {
          if (!this.makeDragClone)
          {
            var nextSibling = this.ownerDOMNode.nextSibling;
            var clone = <HTMLElement> this.ownerDOMNode.cloneNode(true);
            recursiveRemoveAttribute(clone, "data-reactid");

            this.ownerDOMNode.parentNode.insertBefore(clone, nextSibling);
            this.cloneElement = clone;
          }
          else
          {
            var clone = this.makeDragClone();
            document.body.appendChild(clone);
            this.cloneElement = clone;
          }
        }

        if (this.onDragStart)
        {
          this.onDragStart(e);
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
  public handleDrag(e: MouseEvent)
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
  public handleMouseUp(e: MouseEvent)
  {
    // if (this.touchEventTarget)
    // {
    //   var touch = e.changedTouches[0];

    //   var dropTarget = getDropTargetAtLocation(touch.clientX, touch.clientY);
    //   console.log(dropTarget);
    //   if (dropTarget)
    //   {
    //     var reactid = dropTarget.getAttribute("data-reactid");
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
  public handleDragEnd(e: MouseEvent)
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
      var endSuccesful = this.onDragEnd(e);
    }
  }
  private setContainerRect()
  {
    this.containerRect = this.containerElement.getBoundingClientRect();
  }
  private addEventListeners()
  {
    this.containerElement.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    if (this.touchEventTarget)
    {
      this.touchEventTarget.addEventListener("touchmove", this.handleMouseMove);
      this.touchEventTarget.addEventListener("touchend", this.handleMouseUp);
    }
  }
  private removeEventListeners()
  {
    this.containerElement.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);

    if (this.touchEventTarget)
    {
      this.touchEventTarget.removeEventListener("touchmove", this.handleMouseMove);
      this.touchEventTarget.removeEventListener("touchend", this.handleMouseUp);
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
