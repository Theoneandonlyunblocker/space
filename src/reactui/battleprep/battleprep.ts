module Rance
{
  export module UIComponents
  {
    export var BattlePrep = React.createClass(
    {
      displayName: "BattlePrep",
      getInitialState: function()
      {
        return(
        {
          currentDragUnit: null
        });
      },
      handleDragStart: function(unit)
      {
        this.setState(
        {
          currentDragUnit: unit
        });
      },
      handleDragEnd: function(dropSuccesful: boolean = false)
      {
        if (!dropSuccesful && this.state.currentDragUnit)
        {
          this.props.battlePrep.removeUnit(this.state.currentDragUnit);
        }

        this.setState(
        {
          currentDragUnit: null
        });
      },
      handleDrop: function(position)
      {
        var battlePrep = this.props.battlePrep;
        if (this.state.currentDragUnit)
        {
          var unitCurrentlyInPosition = battlePrep.getUnitAtPosition(position);
          if (unitCurrentlyInPosition)
          {
            battlePrep.swapUnits(this.state.currentDragUnit, unitCurrentlyInPosition);
          }
          else
          {
            battlePrep.setUnit(this.state.currentDragUnit, position);
          }

        }

        this.handleDragEnd(true);
      },
      render: function()
      {
        var fleet = UIComponents.Fleet(
        {
          fleet: this.props.battlePrep.fleet.slice(0),

          onMouseUp: this.handleDrop,

          isDraggable: true,
          onDragStart: this.handleDragStart,
          onDragEnd: this.handleDragEnd
        });

        return(
          React.DOM.div({className: "battle-prep"},
            fleet,
            UIComponents.UnitList(
            {
              units: this.props.battlePrep.availableUnits,
              selectedUnits: this.props.battlePrep.alreadyPlaced,

              isDraggable: true,
              onDragStart: this.handleDragStart,
              onDragEnd: this.handleDragEnd
            }),
            React.DOM.button(
            {
              className: "start-battle",
              onClick: function()
              {
                var battle = this.props.battlePrep.makeBattle();
                app.reactUI.battle = battle;
                app.reactUI.switchScene("battle");
              }.bind(this)
            }, "Start battle")
          )
        );
      }
    });
  }
}
