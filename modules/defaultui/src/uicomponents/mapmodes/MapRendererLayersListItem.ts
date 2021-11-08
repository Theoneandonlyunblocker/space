import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {MapRendererLayer} from "core/src/maprenderer/MapRendererLayer";

import {DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import {applyMixins} from "../mixins/applyMixins";


type HoverPosition = "top" | "bottom";

export interface PropTypes extends React.Props<any>
{
  listItemIsDragging: boolean;
  isActive: boolean;
  layer: MapRendererLayer;
  setHoverPosition: (layer: MapRendererLayer, position: HoverPosition) => void;
  hoverSide: HoverPosition | null;
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
  public override state: StateType;

  private dragPositioner: DragPositioner<MapRendererLayersListItemComponent>;
  private readonly ownDOMNode = React.createRef<HTMLLIElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.clearHover = this.clearHover.bind(this);
    this.setLayerAlpha = this.setLayerAlpha.bind(this);

    this.dragPositioner = new DragPositioner(this, this.ownDOMNode, this.props.dragPositionerProps);
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.onDragMove = this.onDragMove;
    this.dragPositioner.onDragEnd = this.onDragEnd;
    applyMixins(this, this.dragPositioner);
  }

  public override componentDidUpdate(prevProps: PropTypes): void
  {
    if (prevProps.listItemIsDragging !== this.props.listItemIsDragging)
    {
      this.clearHover();
    }
  }
  public override render(): React.ReactHTMLElement<HTMLLIElement>
  {
    const liProps: React.HTMLAttributes<HTMLLIElement> & React.ClassAttributes<HTMLLIElement> =
    {
      className: "map-renderer-layers-list-item draggable",
      onMouseDown: this.dragPositioner.handleReactDownEvent,
      onTouchStart: this.dragPositioner.handleReactDownEvent,
      ref: this.ownDOMNode,
    };

    if (this.dragPositioner.isDragging)
    {
      liProps.style = this.dragPositioner.getStyleAttributes();
      liProps.className += " dragging";
    }
    if (this.props.listItemIsDragging)
    {
      liProps.onMouseMove = this.handleHover;
      liProps.onMouseLeave = this.clearHover;
      if (this.props.hoverSide)
      {
        liProps.className += " insert-" + this.props.hoverSide;
      }
    }


    return(
      ReactDOMElements.li(liProps,
        ReactDOMElements.input(
        {
          type: "checkbox",
          className: "map-renderer-layers-list-item-checkbox",
          checked: this.props.isActive,
          onChange: this.props.toggleActive,
        }),
        ReactDOMElements.span(
        {
          className: "map-renderer-layers-list-item-name draggable",
        },
          this.props.layerName,
        ),
        ReactDOMElements.input(
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
    this.dragPositioner.position.top = y;
    this.dragPositioner.updateDOMNodeStyle();
  }

  private onDragEnd(): void
  {
    this.props.onDragEnd();
  }

  private handleHover(e: React.MouseEvent<HTMLLIElement>): void
  {
    const rect = this.ownDOMNode.current.getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;

    const isAbove = e.clientY < midPoint;
    const hoverSide = isAbove ? "top" : "bottom";

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

  private setLayerAlpha(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;
    const value = parseFloat(target.value);
    if (isFinite(value))
    {
      this.props.updateLayer(this.props.layer);
      this.props.layer.alpha = value;
    }
    this.forceUpdate();
  }
}

export const MapRendererLayersListItem: React.Factory<PropTypes> = React.createFactory(MapRendererLayersListItemComponent);
