/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class MapRendererLayersListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "MapRendererLayersListItem";
  mixins: reactTypeTODO_any = [Draggable, DropTarget, React.addons.PureRenderMixin];
  cachedMidPoint: reactTypeTODO_any = undefined;

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      hoverSide: null
    });
  }

  componentWillReceiveProps(newProps: any)
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

  handleHover(e: MouseEvent)
  {
    if (!this.cachedMidPoint)
    {
      var rect = this.getDOMNode().getBoundingClientRect();
      this.cachedMidPoint = rect.top + rect.height / 2;
    }

    var isAbove = e.clientY < this.cachedMidPoint;

    this.setState(
    {
      hoverSide: (isAbove ? "top" : "bottom")
    });

    this.props.setHoverPosition(this.props.layer, isAbove);
  }

  clearHover()
  {
    this.setState(
    {
      hoverSide: null
    });
  }

  setLayerAlpha(e: Event)
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
    var divProps: any =
    {
      className: "map-renderer-layers-list-item draggable draggable-container",
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleMouseDown
    };

    if (this.state.dragging)
    {
      divProps.style = this.dragPos;
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
          value: this.props.layer.alpha,
          onChange: this.setLayerAlpha
        })
      )
    );
  }
}
