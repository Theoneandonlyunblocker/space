/// <reference path="attitudemodifierlist.ts" />

module Rance
{
  export module UIComponents
  {
    export var Opinion = React.createClass(
    {
      displayName: "Opinion",

      getInitialState: function()
      {
        return(
        {
          hasAttitudeModifierTootlip: false
        });
      },

      setTooltip: function()
      {
        this.setState({hasAttitudeModifierTootlip: true});
      },

      clearTooltip: function()
      {
        this.setState({hasAttitudeModifierTootlip: false});
      },
      
      render: function()
      {
        var tooltip = null;
        if (this.state.hasAttitudeModifierTootlip)
        {
          tooltip = UIComponents.AttitudeModifierList(
          {
            attitudeModifiers: this.props.attitudeModifiers,
            onLeave: this.clearTooltip,
            getParentNode: this.getDOMNode
          });
        }
        return(
          React.DOM.div(
          {
            className: "player-opinion",
            onMouseEnter: this.setTooltip,
            onMouseLeave: this.clearTooltip
          },
            this.props.opinion,
            tooltip
          )
        );
      }
    })
  }
}
