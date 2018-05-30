import * as React from "react";

import DragPositioner from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

import {Direction} from "../../Direction";


type DirectionRestriction = "horizontal" | "vertical" | "free";

export interface PropTypes extends React.Props<any>
{
  handleResizeStart: (x: number, y: number) => void;
  handleResizeMove: (x: number, y: number) => void;
  direction: Direction;
}

interface StateType
{
}

export class WindowResizeHandleComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "WindowResizeHandle";
  public state: StateType;

  private dragPositioner: DragPositioner<WindowResizeHandleComponent>;
  private directionRestriction: DirectionRestriction;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();

    switch (this.props.direction)
    {
      case "n":
      case "s":
      {
        this.directionRestriction = "vertical";
        break;
      }
      case "e":
      case "w":
      {
        this.directionRestriction = "horizontal";
        break;
      }
      case "ne":
      case "se":
      case "sw":
      case "nw":
      {
        this.directionRestriction = "free";
        break;
      }
      default:
      {
        throw new Error(`Invalid window resize handle direction '${this.props.direction}'`);
      }
    }

    this.dragPositioner = new DragPositioner(this);
    this.dragPositioner.onDragMove = this.onDragMove;
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.forcedDragOffset = {x: 0, y: 0};
    applyMixins(this, this.dragPositioner);
  }

  public render()
  {
    return(
      React.DOM.div(
      {
        className: "window-resize-handle" + ` window-resize-handle-${this.props.direction}`,
        onTouchStart: this.dragPositioner.handleReactDownEvent,
        onMouseDown: this.dragPositioner.handleReactDownEvent,
      })
    );
  }

  protected onDragStart(x: number, y: number): void
  {
    this.props.handleResizeStart(x, y);
  }
  protected onDragMove(x: number, y: number): void
  {
    const deltaX = x - this.dragPositioner.originPosition.x;
    const deltaY = y - this.dragPositioner.originPosition.y;

    this.props.handleResizeMove(
      this.directionRestriction === "vertical" ? 0 : deltaX,
      this.directionRestriction === "horizontal" ? 0 : deltaY,
    );
  }

  private bindMethods(): void
  {
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(WindowResizeHandleComponent);
export default factory;
