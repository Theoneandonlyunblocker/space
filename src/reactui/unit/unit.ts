/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>
/// <reference path="unitstatuseffects.ts" />
/// <reference path="../mixins/draggable.ts" />

module Rance
{
  export module UIComponents
  {
    export var Unit = React.createClass(
    {
      displayName: "Unit",
      mixins: [Draggable, React.addons.PureRenderMixin],
      
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

      handleClick: function(e)
      {
        this.props.onUnitClick(this.props.unit);
      },

      handleMouseEnter: function(e)
      {
        if (!this.props.handleMouseEnterUnit) return;
        if (this.props.unit.currentHealth <= 0) return;

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
        unit.uiDisplayIsDirty = false;

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
          wrapperProps.onMouseDown = wrapperProps.onTouchStart = this.handleMouseDown;
        }

        if (this.state.dragging)
        {
          wrapperProps.style = this.state.dragPos;
          wrapperProps.className += " dragging";
        }

        if (this.props.onUnitClick)
        {
          wrapperProps.onClick = this.handleClick;
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
          name: unit.name,
          guardAmount: unit.battleStats.guardAmount,
          maxHealth: unit.maxHealth,
          currentHealth: unit.currentHealth,
          isSquadron: unit.isSquadron,
          maxActionPoints: unit.attributes.maxActionPoints,
          currentActionPoints: unit.battleStats.currentActionPoints,

          isDead: this.props.isDead,
          isCaptured: this.props.isCaptured,

          animateDuration: unit.sfxDuration
        }

        var containerElements =
        [
          React.DOM.div(
          {
            className: "unit-left-container",
            key: "leftContainer"
          },
            React.DOM.div({className: "unit-image", key: "image"}), // UNIT IMAGE TODO
            UIComponents.UnitStatusEffects({unit: unit})
          ),
          UIComponents.UnitInfo(infoProps),
        ];

        if (this.props.facesLeft)
        {
          containerElements = containerElements.reverse();
        }

        if (unit.displayFlags.isAnnihilated)
        {
          containerElements.push(
            React.DOM.div({key: "overlay", className: "unit-annihilated-overlay"},
              "Unit annihilated"
            )
          );
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
