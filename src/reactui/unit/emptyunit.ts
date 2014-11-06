/// <reference path="uniticon.ts"/>

module Rance
{
  export module UIComponents
  {
    export var EmptyUnit = React.createClass(
    {
      render: function()
      {
        var containerProps =
        {
          className: "unit-container",
          key: "container"
        };

        if (this.props.facesLeft)
        {
          containerProps.className += " enemy-unit";
        }
        else
        {
          containerProps.className += " friendly-unit";
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
          React.DOM.div({className: "unit-wrapper"},
            allElements
          )
        );
      }
    });
  }
}