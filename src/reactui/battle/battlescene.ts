module Rance
{
  export module UIComponents
  {
    export var BattleScene = React.createClass(
    {
      displayName: "BattleScene",

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "battle-scene"
          },
            React.DOM.div(
            {
              className: "battle-scene-units-container"
            },
              this.props.unit1 ? this.props.unit1.id : null
            ),
            React.DOM.div(
            {
              className: "battle-scene-units-container"
            },
              this.props.unit2 ? this.props.unit2.id : null
            )
          )
        );
      }
    })
  }
}
