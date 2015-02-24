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

        if (newProps.unit && newProps.unit.uiDisplayIsDirty) return true;

        var targetedProps =
        {
          activeUnit: true,
          hoveredUnit: true,
          targetsInPotentialArea: true,
          activeEffectUnits: true
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

          if (prop === "targetsInPotentialArea" || prop === "activeEffectUnits")
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

        if (newProps.battle && newProps.battle.ended)
        {
          return true;
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
        if (this.props.activeEffectUnits)
        {
          if (this.props.activeEffectUnits.indexOf(this.props.unit) >= 0)
          {
            wrapperProps.className += " active-effect-unit";
          }
        }

        var empty = UIComponents.EmptyUnit(
        {
          facesLeft: this.props.facesLeft,
          key: "empty_" + this.props.key,
          position: this.props.position
        });

        allElements.push(empty);

        if (this.props.unit)
        {

          var isDead = false;
          if (this.props.battle &&
            this.props.battle.deadUnits && this.props.battle.deadUnits.length > 0)
          {
            if (this.props.battle.deadUnits.indexOf(this.props.unit) >= 0)
            {
              this.props.isDead = true;
            }
          }

          var isCaptured = false;
          if (this.props.battle &&
            this.props.battle.capturedUnits && this.props.battle.capturedUnits.length > 0)
          {
            if (this.props.battle.capturedUnits.indexOf(this.props.unit) >= 0)
            {
              this.props.isCaptured = true;
            }
          }

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