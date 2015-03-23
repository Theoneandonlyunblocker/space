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
          isNull: true,
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
      updateColor: function(hexColor: number, isNull: boolean)
      {
        if (isNull)
        {
          this.setState({isNull: isNull});
        }
        else
        {
          this.setState({hexColor: hexColor, isNull: isNull});
        }

        if (this.props.onChange)
        {
          this.props.onChange(hexColor, isNull);
        }
      },

      render: function()
      {
        var displayElement = this.state.isNull ?
          React.DOM.img(
          {
            className: "color-setter-display",
            src: "img\/icons\/nullcolor.png",
            onClick: this.toggleActive
          }) :
          React.DOM.div(
          {
            className: "color-setter-display",
            style:
            {
              backgroundColor: "#" + hexToString(this.state.hexColor)
            },
            onClick: this.toggleActive
          });

        return(
          React.DOM.div({className: "color-setter"},
            displayElement,
            this.props.isActive || this.state.isActive ?
              UIComponents.ColorPicker(
              {
                ref: "colorPicker",
                hexColor: this.state.hexColor,
                generateColor: this.props.generateColor,
                onChange: this.updateColor
              }) : null
          )
        );
      }
    })
  }
}
