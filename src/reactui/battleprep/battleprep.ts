module Rance
{
  export module UIComponents
  {
    export var BattlePrep = React.createClass(
    {
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
      handleDragEnd: function()
      {
        this.setState(
        {
          currentDragUnit: null
        });
      },
      handleDrop: function(position)
      {
        if (this.state.currentDragUnit)
        {
          this.props.battlePrep.setUnit(this.state.currentDragUnit, position);
        }

        this.handleDragEnd();
      },
      render: function()
      {
        var fleet = UIComponents.Fleet(
        {
          fleet: this.props.battlePrep.fleet,

          onMouseUp: this.handleDrop
        });

        return(
          React.DOM.div({className: "battle-prep"},
            fleet,
            UIComponents.UnitList(
            {
              units: this.props.battlePrep.player.units,
              onDragStart: this.handleDragStart,
              onDragEnd: this.handleDragEnd
            })
          )
        );
      }
    });
  }
}
