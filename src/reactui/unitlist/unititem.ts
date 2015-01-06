module Rance
{
  export module UIComponents
  {
    export var UnitItem = React.createClass(
    {
      displayName: "UnitItem",
      mixins: [Draggable],

      onDragStart: function(e)
      {
        this.props.onDragStart(this.props.item);
      },
      onDragEnd: function(e)
      {
        this.props.onDragEnd();
      },
      // todo
      getTechIcon: function(techLevel: number)
      {
        switch (techLevel)
        {
          case 2:
          {
            return "img\/items\/t2icon.png"
          }
          case 3:
          {
            return "img\/items\/t3icon.png"
          }
        }
      },

      render: function()
      {
        if (!this.props.item) return(
          React.DOM.div({className: "empty-unit-item"})
        );
        var item = this.props.item;

        var divProps: any =
        {
          className: "unit-item"
        };
        
        if (this.props.isDraggable)
        {
          divProps.className += " draggable";
          divProps.onMouseDown = divProps.onTouchStart =
            this.handleMouseDown;
        }

        if (this.state.dragging)
        {
          divProps.style = this.state.dragPos;
          divProps.className += " dragging";
        }

        return(
          React.DOM.div(divProps,
            React.DOM.div(
            {
              className: "item-icon-container"
            },
              React.DOM.img(
              {
                className: "item-icon-base",
                src: item.template.icon
              }),
              item.template.techLevel > 1 ? React.DOM.img(
              {
                className: "item-icon-tech-level",
                src: this.getTechIcon(item.template.techLevel)
              }) : null
            )
          )
        );
      }
    });
  }
}