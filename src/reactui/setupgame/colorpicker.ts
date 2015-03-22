/// <reference path="../../color.ts" />

module Rance
{
  export module UIComponents
  {
    export var ColorPicker = React.createClass(
    {
      displayName: "ColorPicker",

      getInitialState: function()
      {
        var hexColor = this.props.hexColor || 0xFFFFFF;

        return(
        {
          hexColor: hexColor,
          hexString: "#" + hexToString(hexColor),
          hsvColor: colorFromScalars(hexToHsv(hexColor))
        });
      },

      updateColor: function()
      {
        var newHexString = this.refs.hex.getDOMNode().value;
        if (this.state.hexString === newHexString)
        {
          var hue = parseInt(this.refs.hue.getDOMNode().value);
          var sat = parseInt(this.refs.sat.getDOMNode().value);
          var val = parseInt(this.refs.cal.getDOMNode().value);

          var hexColor = hsvToHex(scalarsFromColor([hue, sat, val]));
          var hexString = "#" + hexToString(hexColor);
        }
        else
        {
          var hexString = newHexString;
          var hexColor = stringToHex(hexString);
          var hsvColor = colorFromScalars(hexToHsv(hexColor));
          this.setState(
          {
            hexColor: hexColor,
            hexString: hexString,
            hsvColor: hsvColor
          });
        }

      },

      render: function()
      {
        return(
          React.DOM.div({className: "color-picker"},
            React.DOM.div(
            {
              className: "color-picker-display",
              style:
              {
                backgroundColor: this.state.hexString
              }
            }),
            React.DOM.div({className: "color-picker-inputs-container"},
              React.DOM.div({className: "color-picker-hsv"},
                React.DOM.input(
                {
                  className: "color-picker-hsv-input",
                  ref: "hue",
                  value: this.
                  onChange: this.updateColor
                })
              ),
              React.DOM.input(
              {
                className: "color-picker-hex-input",
                ref: "hex",
                value: this.state.hexString,
                onChange: this.updateColor
              })
            )
          )
        );
      }
    })
  }
}
