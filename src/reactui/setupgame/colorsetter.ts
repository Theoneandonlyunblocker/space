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
          hexColor: this.props.color || 0xFFFFFF,
          active: false
        });
      },

      toggleActive: function()
      {
        if (this.state.isActive)
        {
          this.setAsInactive();
        }
        else
        {
          if (this.props.setActiveColorPicker)
          {
            this.props.setActiveColorPicker(this);
          }
          this.setState({isActive: true});
        }
      },
      setAsInactive: function()
      {
        if (this.isMounted() && this.state.isActive)
        {
          this.setState({isActive: false});
        }
      },
      updateColor: function(hexColor: number)
      {
        this.setState({hexColor: hexColor});
        if (this.props.onChange)
        {
          this.props.onChange(hexColor);
        }
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
              onClick: this.toggleActive
            }),
            this.props.isActive || this.state.isActive ?
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
