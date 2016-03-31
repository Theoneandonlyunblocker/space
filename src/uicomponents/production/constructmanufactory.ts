/// <reference path="../../star.ts" />

module Rance
{
  export module UIComponents
  {
    export var ConstructManufactory = React.createFactory(React.createClass(
    {
      displayName: "ConstructManufactory",
      mixins: [React.addons.PureRenderMixin],

      propTypes:
      {
        star: React.PropTypes.instanceOf(Star).isRequired,
        player: React.PropTypes.instanceOf(Player).isRequired,
        triggerUpdate: React.PropTypes.func.isRequired,
        money: React.PropTypes.number.isRequired
      },

      getInitialState: function()
      {
        return(
        {
          canAfford: this.props.money >= app.moduleData.ruleSet.manufactory.buildCost
        });
      },
      
      componentWillReceiveProps: function(newProps: any)
      {
        this.setState(
        {
          canAfford: newProps.money >= app.moduleData.ruleSet.manufactory.buildCost
        });
      },

      handleConstruct: function()
      {
        var star: Star = this.props.star;
        var player: Player = this.props.player;
        star.buildManufactory();
        player.money -= app.moduleData.ruleSet.manufactory.buildCost;
        this.props.triggerUpdate();
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "construct-manufactory-container"
          },
            React.DOM.button(
            {
              className: "construct-manufactory-button" + (this.state.canAfford ? "" : " disabled"),
              onClick: this.state.canAfford ? this.handleConstruct : null,
              disabled: !this.state.canAfford
            },
              React.DOM.span(
              {
                className: "construct-manufactory-action"
              },
                "Construct manufactory"
              ),
              React.DOM.span(
              {
                className: "construct-manufactory-cost money-style" +
                  (this.state.canAfford ? "" : " negative")
              },
                app.moduleData.ruleSet.manufactory.buildCost
              )
            )
          )
        );
      }
    }));
  }
}
