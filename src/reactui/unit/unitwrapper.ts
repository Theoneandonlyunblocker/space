/// <reference path="uniticon.ts"/>

module Rance
{
  export module UIComponents
  {
    export var UnitWrapper = React.createClass(
    {
      shouldComponentUpdate: function(newProps: any)
      {
        if (!this.props.unit && !newProps.unit) return false;

        var targetedProps =
        {
          activeUnit: true,
          hoveredUnit: true,
          targetsInPotentialArea: true
        };

        for (var prop in newProps)
        {
          if (!targetedProps[prop] && prop !== "position")
          {
            if (newProps[prop] !== this.props[prop])
            {
              return true;
            }
          }
        }
        for (var prop in targetedProps)
        {
          var unit = newProps.unit;
          var oldValue = this.props[prop];
          var newValue = newProps[prop];

          if (!newValue && !oldValue) continue;

          if (prop === "targetsInPotentialArea")
          {
            if (!oldValue)
            {
              if (newValue.indexOf(unit) >= 0) return true;
              else
              {
                continue;
              }
            }
            if ((oldValue.indexOf(unit) >= 0) !==
              (newValue.indexOf(unit) >= 0))
            {
              return true;
            }
          }
          else if (newValue !== oldValue &&
            (oldValue === unit || newValue === unit))
          {
            return true;
          }
        }
        return false;
      },
      displayName: "UnitWrapper",
      handleMouseUp: function()
      {
        this.props.onMouseUp(this.props.position);
      },

      render: function()
      {
        var allElements = [];

        var wrapperProps: any =
        {
          className: "unit-wrapper"
        };

        if (this.props.onMouseUp)
        {
          wrapperProps.onMouseUp = this.handleMouseUp
        };

        var empty = UIComponents.EmptyUnit(
        {
          facesLeft: this.props.facesLeft,
          key: "empty_" + this.props.key,
          position: this.props.position
        });

        allElements.push(empty);

        if (this.props.unit)
        {
          var unit = UIComponents.Unit(this.props);
          allElements.push(unit);
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