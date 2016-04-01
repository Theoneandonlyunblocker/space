/// <reference path="../../star.ts" />

export interface PropTypes
{
  star: Star;
  player: Player;
  triggerUpdate: reactTypeTODO_func;
  money: number;
}

export default class ConstructManufactory extends React.Component<PropTypes, Empty>
{
  displayName: "ConstructManufactory",
  mixins: [React.addons.PureRenderMixin],


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
}
