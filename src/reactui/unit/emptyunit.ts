module Rance
{
  export module UIComponents
  {
    export var EmptyUnit = React.createClass(
    {
      handleMouseUp: function()
      {
        console.log("mouseup", this.props.position);
        this.props.onMouseUp(this.props.position);
      },

      componentDidMount: function()
      {
        if (this.props.onMouseUp)
        {
          this.getDOMNode().addEventListener("mouseup", this.handleMouseUp)
        }
      },

      render: function()
      {
        var wrapperProps: any =
        {
          className: "unit empty-unit"
        };

        var containerProps =
        {
          className: "unit-container",
          key: "container"
        };

        if (this.props.facesLeft)
        {
          wrapperProps.className += " enemy-unit";
        }
        else
        {
          wrapperProps.className += " friendly-unit";
        }

        var allElements =
        [
          React.DOM.div(containerProps,
            null
          ),
          UIComponents.UnitIcon(
            {
              icon: null,
              facesLeft: this.props.facesLeft,
              key: "icon"
            })
        ];

        if (this.props.facesLeft)
        {
          allElements = allElements.reverse();
        }
        
        return(
          React.DOM.div(wrapperProps,
            allElements
          )
        );
      }
    });
  }
}