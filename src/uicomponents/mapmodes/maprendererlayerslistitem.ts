module Rance
{
  export module UIComponents
  {
    export var MapRendererLayersListItem = React.createClass(
    {
      displayName: "MapRendererLayersListItem",
      render: function()
      {
        return(
          React.DOM.li(
          {
            className: "map-renderer-layers-list-item draggable-container"
          },
            React.DOM.input(
            {
              type: "checkbox",
              className: "map-renderer-layers-list-item-checkbox",
              checked: this.props.isActive,
              onChange: this.props.toggleActive
            }),
            React.DOM.span(
            {
              className: "map-renderer-layers-list-item-name"
            },
              this.props.layerName
            )
          )
        );
      }
    })
  }
}
