/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>
/// <reference path="../mixins/draggable.ts" />

module Rance
{
  export module UIComponents
  {
    export var Unit = React.createClass(
    {
      mixins: [Draggable],
      
      getInitialState: function()
      {
        return(
        {
          hasPopup: false,
          popupElement: null
        });
      },

      onDragStart: function(e)
      {
        this.props.onDragStart(this.props.unit);
      },
      onDragEnd: function(e)
      {
        this.props.onDragEnd();
      },

      handleMouseEnter: function(e)
      {
        if (!this.props.handleMouseEnterUnit) return;

        this.props.handleMouseEnterUnit(this.props.unit);
      },
      handleMouseLeave: function(e)
      {
        if (!this.props.handleMouseLeaveUnit) return;

        this.props.handleMouseLeaveUnit(e);
      },

      render: function()
      {
        var unit = this.props.unit;

        var containerProps: any =
        {
          className: "unit-container",
          key: "container"
        };
        var wrapperProps: any =
        {
          className: "unit",
          id: "unit-id_" + unit.id
        };

        wrapperProps.onMouseEnter = this.handleMouseEnter;
        wrapperProps.onMouseLeave = this.handleMouseLeave;

        if (this.props.isDraggable)
        {
          wrapperProps.className += " draggable";
          wrapperProps.onMouseDown = this.handleMouseDown;
        }

        if (this.state.dragging)
        {
          wrapperProps.style = this.state.dragPos;
          wrapperProps.className += " dragging";
        }

        if (this.props.facesLeft)
        {
          wrapperProps.className += " enemy-unit";
        }
        else
        {
          wrapperProps.className += " friendly-unit";
        }

        var isActiveUnit = ( this.props.activeUnit &&
          unit.id === this.props.activeUnit.id);

        if (isActiveUnit)
        {
          wrapperProps.className += " active-unit";
        }

        var isInPotentialTargetArea = (this.props.targetsInPotentialArea &&
          this.props.targetsInPotentialArea.indexOf(unit) >= 0);

        if (isInPotentialTargetArea)
        {
          wrapperProps.className += " target-unit";
        }

        if (this.props.hoveredUnit && this.props.hoveredUnit.id === unit.id)
        {
          wrapperProps.className += " hovered-unit";
        }

        var infoProps =
        {
          key: "info",
          unit: unit
        }

        var containerElements =
        [
          React.DOM.div({className: "unit-image", key: "image"}),
          UIComponents.UnitInfo(infoProps),
        ];

        if (this.props.facesLeft)
        {
          containerElements = containerElements.reverse();
        }

        var allElements =
        [
          React.DOM.div(containerProps,
            containerElements
          ),
          UIComponents.UnitIcon(
            {
              icon: unit.template.icon,
              facesLeft: this.props.facesLeft,
              key: "icon",
              isActiveUnit: isActiveUnit
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
