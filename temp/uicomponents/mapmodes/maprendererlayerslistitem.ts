export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class MapRendererLayersListItem extends React.Component<PropTypes, {}>
{
  displayName: "MapRendererLayersListItem";
  mixins: [Draggable, DropTarget, React.addons.PureRenderMixin];
  cachedMidPoint: undefined;

  getInitialState: function()
  {
    return(
    {
      hoverSide: null
    });
  }

  componentWillReceiveProps: function(newProps: any)
  {
    if (newProps.listItemIsDragging !== this.props.listItemIsDragging)
    {
      this.cachedMidPoint = undefined;
      this.clearHover();
    }
  }


  onDragStart: function()
  {
    this.props.onDragStart(this.props.layer);
  }

  onDragEnd: function()
  {
    this.props.onDragEnd();
  }

  handleHover: function(e: MouseEvent)
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

  clearHover: function()
  {
    this.setState(
    {
      hoverSide: null
    });
  }

  setLayerAlpha: function(e: Event)
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

  render: function()
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
