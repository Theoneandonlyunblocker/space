/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import MapRendererLayer from "../../MapRendererLayer";

import {default as DragPositioner, DragPositionerProps} from "../mixins/DragPositioner";
import applyMixins from "../mixins/applyMixins";

interface PropTypes extends React.Props<any>
{
  listItemIsDragging: boolean;
  isActive: boolean;
  layer: MapRendererLayer;
  setHoverPosition: (layer: MapRendererLayer, position: string) => void;
  toggleActive: () => void;
  updateLayer: (layer: MapRendererLayer) => void;
  layerName: string;
  
  onDragEnd: () => void;
  onDragStart: (layer: MapRendererLayer) => void;
  dragPositionerProps: DragPositionerProps;
}

interface StateType
{
  hoverSide?: "top" | "bottom";
}

export class MapRendererLayersListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "MapRendererLayersListItem";
  cachedMidPoint: number; // Y mid point for list item

  state: StateType;
  dragPositioner: DragPositioner<MapRendererLayersListItemComponent>; 

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
    this.dragPositioner = new DragPositioner(this, this.props.dragPositionerProps);
    this.dragPositioner.onDragStart = this.onDragStart;
    this.dragPositioner.onDragEnd = this.onDragEnd;
    applyMixins(this, this.dragPositioner);
  }
  private bindMethods()
  {
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.clearHover = this.clearHover.bind(this);
    this.setLayerAlpha = this.setLayerAlpha.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      hoverSide: null
    });
  }
  
  componentShouldUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (newProps.listItemIsDragging !== this.props.listItemIsDragging)
    {
      this.cachedMidPoint = undefined;
      this.clearHover();
    }
  }


  onDragStart()
  {
    this.props.onDragStart(this.props.layer);
  }

  onDragEnd()
  {
    this.props.onDragEnd();
  }

  handleHover(e: React.MouseEvent)
  {
    if (!this.cachedMidPoint)
    {
      var rect = React.findDOMNode(this).getBoundingClientRect();
      this.cachedMidPoint = rect.top + rect.height / 2;
    }

    var isAbove = e.clientY < this.cachedMidPoint;
    const hoverSide: "top" | "bottom" = isAbove ? "top" : "bottom";

    this.setState(
    {
      hoverSide: hoverSide
    });

    this.props.setHoverPosition(this.props.layer, hoverSide);
  }

  clearHover()
  {
    this.setState(
    {
      hoverSide: null
    });
  }

  setLayerAlpha(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    var value = parseFloat(target.value)
    if (isFinite(value))
    {
      this.props.updateLayer(this.props.layer);
      this.props.layer.alpha = value;
    }
    this.forceUpdate();
  }

  render()
  {
    var divProps: React.HTMLAttributes =
    {
      className: "map-renderer-layers-list-item draggable draggable-container",
      onMouseDown: this.dragPositioner.handleReactDownEvent,
      onTouchStart: this.dragPositioner.handleReactDownEvent
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
      if (this.state.hoverSide)
      {
        divProps.className += " insert-" + this.state.hoverSide;
      }
    }


    return(
      React.DOM.li(divProps,
        React.DOM.input(
        {
          type: "checkbox",
          className: "map-renderer-layers-list-item-checkbox",
          checked: this.props.isActive,
          onChange: this.props.toggleActive
        }),
        React.DOM.span(
        {
          className: "map-renderer-layers-list-item-name draggable-container"
        },
          this.props.layerName
        ),
        React.DOM.input(
        {
          className: "map-renderer-layers-list-item-alpha",
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
          value: "" + this.props.layer.alpha,
          onChange: this.setLayerAlpha
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapRendererLayersListItemComponent);
export default Factory;
