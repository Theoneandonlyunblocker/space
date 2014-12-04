module Rance
{
  export module UIComponents
  {
    export var EmptyUnit = React.createClass(
    {
      displayName: "EmptyUnit",
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