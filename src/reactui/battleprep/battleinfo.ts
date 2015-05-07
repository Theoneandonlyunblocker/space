/// <reference path="../galaxymap/defencebuildinglist.ts"/>

module Rance
{
  export module UIComponents
  {
    export var BattleInfo = React.createClass(
    {
      displayName: "BattleInfo",
      render: function()
      {
        var battlePrep = this.props.battlePrep;
        var star = battlePrep.battleData.location;
        var isAttacker = battlePrep.humanPlayer === battlePrep.attacker;

        return(
          React.DOM.div(
          {
            className: "battle-info"
          },
            React.DOM.div(
            {
              className: "battle-info-opponent"
            },
              React.DOM.img(
              {
                className: "battle-info-opponent-icon",
                src: battlePrep.enemyPlayer.icon
              }),
              React.DOM.div(
              {
                className: "battle-info-opponent-name"
              },
                battlePrep.enemyPlayer.name
              )
            ),
            React.DOM.div(
            {
              className: "battle-info-summary"
            },
              star.name + ": " + (isAttacker ? "Attacking" : "Defending")
            ),
            UIComponents.DefenceBuildingList(
            {
              buildings: star.buildings["defence"],
              reverse: isAttacker
            })
          )
        );
      }
    })
  }
}
