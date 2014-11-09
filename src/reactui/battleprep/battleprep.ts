/// <reference path="../battle/fleet.ts"/>
/// <reference path="../unitlist/unitlist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var BattlePrep = React.createClass(
    {
      render: function()
      {
        var fleet = UIComponents.Fleet(
        {
          fleet: this.props.battlePrep.fleet,
        });

        return(
          React.DOM.div({className: "battle-prep"},
            fleet,
            UIComponents.UnitList({units: this.props.battlePrep.player.units})
          )
        );
      }
    });
  }
}
