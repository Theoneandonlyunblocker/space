/// <reference path="../../../lib/react-global.d.ts" />

import MapRendererLayer from "../../MapRendererLayer";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

export interface PropTypes extends React.Props<any>
{
  listItemIsDragging: boolean;
  isActive: boolean;
  layer: MapRendererLayer;
  setHoverPosition: (layer: MapRendererLayer, position: string) => void;
  hoverSide: "top" | "bottom" | null;
  toggleActive: () => void;
  updateLayer: (layer: MapRendererLayer) => void;
  layerName: string;

  onDragEnd: () => void;
  onDragStart: (layer: MapRendererLayer) => void;
  dragPositionerProps: DragPositionerProps;
}

interface StateType
{
}

export class MapRendererLayersListItemComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName: string = "MapRendererLayersListItem";
  public state: StateType;

  private dragPositioner: DragPositioner<MapRendererLayersListItemComponent>;

  constructor(props: PropTypes)
  {
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.clearHover = this.clearHover.bind(this);
    this.setLayerAlpha = this.setLayerAlpha.bind(this);

    this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.onDragMove = this.onDragMove;
    this.dragPositioner.onDragEnd = this.onDragEnd;
    applyMixins(this, this.dragPositioner);
  }

  public componentWillReceiveProps(newProps: PropTypes): void
  {
    if (newProps.listItemIsDragging !== this.props.listItemIsDragging)
    {
      this.clearHover();
    }
  }
  public render(): React.ReactHTMLElement<HTMLLIElement>
  {
    const divProps: React.HTMLAttributes =
    {
      className: "map-renderer-layers-list-item draggable draggable-container",
      onMouseDown: this.dragPositioner.handleReactDownEvent,
      onTouchStart: this.dragPositioner.handleReactDownEvent,
    };

    if (this.dragPositioner.isDragging)
    {
      divProps.style = this.dragPositioner.getStyleAttributes();
      divProps.className += " dragging";
    }
    if (this.props.listItemIsDragging)
    {
      divProps.onMouseMove = this.handleHover;
      divProps.onMouseLeave = this.clearHover;
      if (this.props.hoverSide)
      {
        divProps.className += " insert-" + this.props.hoverSide;
      }
    }


    return(
      React.DOM.li(divProps,
        React.DOM.input(
        {
          type: "checkbox",
          className: "map-renderer-layers-list-item-checkbox",
          checked: this.props.isActive,
          onChange: this.props.toggleActive,
        }),
        React.DOM.span(
        {
          className: "map-renderer-layers-list-item-name draggable-container",
        },
          this.props.layerName,
        ),
        React.DOM.input(
        {
          className: "map-renderer-layers-list-item-alpha",
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
          value: "" + this.props.layer.alpha,
          onChange: this.setLayerAlpha,
        }),
      )
    );
  }

  private onDragStart(): void
  {
    this.props.onDragStart(this.props.layer);
  }

  private onDragMove(x: number, y: number): void
  {
    this.dragPositioner.dragPos.y = y;
    this.dragPositioner.updateDOMNodeStyle();
  }

  private onDragEnd(): void
  {
    this.props.onDragEnd();
  }

  private handleHover(e: React.MouseEvent): void
  {
    const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;

    const isAbove = e.clientY < midPoint;
    const hoverSide: "top" | "bottom" = isAbove ? "top" : "bottom";

    this.setState(
    {
      hoverSide: hoverSide,
    });

    this.props.setHoverPosition(this.props.layer, hoverSide);
  }

  private clearHover(): void
  {
    this.setState(
    {
      hoverSide: null,
    });
  }

  private setLayerAlpha(e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;
    const value = parseFloat(target.value)
    if (isFinite(value))
    {
      this.props.updateLayer(this.props.layer);
      this.props.layer.alpha = value;
    }
    this.forceUpdate();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapRendererLayersListItemComponent);
export default Factory;
