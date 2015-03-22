/// <reference path="colorpicker.ts" />

module Rance
{
  export module UIComponents
  {
    export var ColorSetter = React.createClass(
    {
      displayName: "ColorSetter",
      getInitialState: function()
      {
        return(
        {
          hexColor: this.props.color || 0xFFFFFF
        });
      },

      setAsActive: function()
      {
        this.props.setActiveColorPicker(this.key);
      },
      updateColor: function(hexColor: number)
      {
        this.setState({hexColor: hexColor});
      },

      render: function()
      {
        return(
          React.DOM.div({className: "color-setter"},
            React.DOM.div(
            {
              className: "color-setter-display",
              style:
              {
                backgroundColor: "#" + hexToString(this.state.hexColor)
              },
              onClick: this.setAsActive
            }),
            this.props.isActive ?
              UIComponents.ColorPicker(
              {
                hexColor: this.state.hexColor,
                onChange: this.updateColor
              }) : null
          )
        );
      }
    })
  }
}
