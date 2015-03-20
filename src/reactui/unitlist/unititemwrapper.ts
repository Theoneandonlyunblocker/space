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

      componentDidMount: function()
      {
        console.log("update", this._rootNodeID);
      },

      componentDidUpdate: function()
      {
        console.log("update", this._rootNodeID);
      },

      render: function()
      {
        var allElements = [];
        var item = this.props.item;

        var wrapperProps: any =
        {
          className: "unit-item-wrapper"
        };

        // if this is declared inside the conditional block
        // the component won't accept the first drop properly
        if (this.props.onMouseUp)
        {
          wrapperProps.onMouseUp = this.handleMouseUp
        };

        if (this.props.currentDragItem)
        {
          var dragItem = this.props.currentDragItem;
          if (dragItem.template.slot === this.props.slot)
          {
            wrapperProps.className += " drop-target";
          }
          else
          {
            wrapperProps.onMouseUp = null;
            wrapperProps.className += " invalid-drop-target";
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