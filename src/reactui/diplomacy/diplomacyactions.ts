module Rance
{
  export module UIComponents
  {
    export var DiplomacyActions = React.createClass(
    {
      displayName: "DiplomacyActions",

      handleDeclareWar: function()
      {
        this.props.player.declareWarOn(this.props.targetPlayer);
      },

      render: function()
      {
        var player = this.props.player;
        var targetPlayer = this.props.targetPlayer;

        var declareWarProps: any =
        {
          className: "diplomacy-action-button"
        };

        if (player.diplomacyStatus.canDeclareWarOn(targetPlayer))
        {
          declareWarProps.onClick = this.handleDeclareWar;
        }
        else
        {
          declareWarProps.disabled = true;
          declareWarProps.className += " disabled";
        }

        return(
          React.DOM.div(
          {
            className: "diplomacy-actions"
          },
            React.DOM.button(declareWarProps,
              "Declare war"
            ),
            React.DOM.button(
            {
              className: "diplomacy-action-button"
            },
              "Dummy"
            ),
            React.DOM.button(
            {
              className: "diplomacy-action-button"
            },
              "Dummy"
            ),
            React.DOM.button(
            {
              className: "diplomacy-action-button"
            },
              "Dummy"
            )
          )
        );
      }
    })
  }
}
