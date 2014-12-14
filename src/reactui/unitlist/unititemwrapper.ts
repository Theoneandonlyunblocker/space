/// <reference path="unititem.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitItemWrapper = React.createClass(
    {
      displayName: "UnitItemWrapper",
      handleMouseUp: function()
      {
        this.props.onMouseUp(this.props.slot);
      },

      render: function()
      {
        var allElements = [];
        var item = this.props.item;

        var wrapperProps: any =
        {
          className: "unit-item-wrapper"
        };

        if (this.props.currentDragItem)
        {
          var dragItem = this.props.currentDragItem;
          if (dragItem.template.slot === this.props.slot)
          {
            if (this.props.onMouseUp)
            {
              wrapperProps.onMouseUp = this.handleMouseUp
            };
          }
          else
          {
            wrapperProps.className += " invalid-drop-target"
          }
        }
        
        return(
          React.DOM.div(wrapperProps,
            UIComponents.UnitItem(
            {
              item: this.props.item,
              key: "item",

              isDraggable: this.props.isDraggable,
              onDragStart: this.props.onDragStart,
              onDragEnd: this.props.onDragEnd
            })
          )
        );
      }
    });
  }
}