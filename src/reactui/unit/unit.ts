/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>

module Rance
{
  export module UIComponents
  {
    export var Unit = React.createClass(
    {
      getInitialState: function()
      {
        return(
        {
          hasPopup: false,
          popupElement: null
        });
      },

      tooltipContent: function()
      {
        return React.DOM.div(null, "lol");

        if (!this.props.activeTargets ||
          !this.props.activeTargets[this.props.unit.id])
        {
          return null;
        }

        var elements = [];
        var targetableOnThis = this.props.activeTargets[this.props.unit.id];

        for (var i = 0; i < targetableOnThis.length; i++)
        {
          elements.push(
            React.DOM.div({key: ""+ i},
              targetableOnThis[i].name
            )
          );
        }

        return React.DOM.div(null,
          elements
        )
      },

      handleMouseEnter: function(e)
      {
        if (this.state.hasPopup) return;

        
        var popupElement = document.createElement("div");

        document.body.appendChild(popupElement);
        popupElement.innerHTML = this.props.unit.name;
        popupElement.classList.add("tooltip");

        this.setState(
        {
          hasPopup: true,
          popupElement: popupElement
        });
      },

      handleMouseLeave: function(e)
      {
        console.log(e.nativeEvent.toElement, e.nativeEvent.toElement === this.state.popupElement)
        if (this.state.hasPopup)
        {
          if (e.nativeEvent.toElement !== this.getDOMNode() &&
            e.nativeEvent.toElement !== this.state.popupElement)
          {
            document.body.removeChild(this.state.popupElement);
            this.setState(
            {
              hasPopup: false,
              popupElement: null
            });
          }
        }
      },

      render: function()
      {
        var unit = this.props.unit;

        var containerProps =
        {
          className: "unit-container",
          key: "container"
        };
        var wrapperProps =
        {
          className: "unit-wrapper",
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave
        };

        if (this.props.facesLeft)
        {
          containerProps.className += " enemy-unit";
          wrapperProps.className += " enemy-unit-bg";
        }
        else
        {
          containerProps.className += " friendly-unit";
          wrapperProps.className += " friendly-unit-bg";
        }

        var isActiveUnit = (unit.id === this.props.activeUnit.id);

        if (isActiveUnit)
        {
          containerProps.className += " active-unit";
          wrapperProps.className += " active-unit-bg";
        }

        var infoProps =
        {
          key: "info",
          name: unit.name,
          strengthProps:
          {
            maxStrength: unit.maxStrength,
            currentStrength: unit.currentStrength,
            isSquadron: unit.isSquadron
          },
          actionProps:
          {
            maxActionPoints: unit.maxActionPoints,
            currentActionPoints: unit.currentActionPoints
          }
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