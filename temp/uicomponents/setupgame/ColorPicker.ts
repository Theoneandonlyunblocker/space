/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../color.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class ColorPicker_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "ColorPicker";
  onChangeTimeout: reactTypeTODO_any = null;

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    var hexColor = this.props.hexColor || 0xFFFFFF;
    var hexString = "#" + hexToString(hexColor);
    var hsvColor = colorFromScalars(hexToHsv(hexColor));

    return(
    {
      hexColor: hexColor,
      hexString: hexString,
      lastValidHexString: hexString,
      hue: hsvColor[0],
      sat: hsvColor[1],
      val: hsvColor[2],
      isNull: true
    });
  }

  componentDidMount()
  {
    window.addEventListener("resize", this.setPosition);
    this.setPosition();
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.setPosition);
  }

  setPosition()
  {
    var parentRect = this.props.getParentPosition();
    var domNode = this.getDOMNode();
    domNode.style.top = "" + parentRect.bottom + "px";
    domNode.style.left = "" + parentRect.left + "px";
  }

  triggerParentOnChange(color: number, isNull: boolean)
  {
    if (this.onChangeTimeout)
    {
      window.clearTimeout(this.onChangeTimeout);
      this.onChangeTimeout = null;
    }

    this.onChangeTimeout = window.setTimeout(this.props.onChange.bind(null, color, isNull), 50);
  }

  updateFromHsv(hue: number, sat: number, val: number, e?: Event)
  {
    var hsvColor = [hue, sat, val];
    var hexColor = Math.round(hsvToHex.apply(null, scalarsFromColor(hsvColor)));
    var hexString = "#" + hexToString(hexColor);

    this.setState(
    {
      hexColor: hexColor,
      hexString: hexString,
      lastValidHexString: hexString,
      isNull: false
    });

    if (this.props.onChange)
    {
      var target = <HTMLInputElement> e.target;
      // prevent onchange events from constantly having to render custom image
      if (!this.props.limitUpdates ||
        (!this.props.flagHasCustomImage ||
        target.type !== "range" ||
        e.type !== "input"))
      {
        this.triggerParentOnChange(hexColor, false);
      }
    }
  }
  updateFromHex(hexColor: number)
  {
    var hsvColor = colorFromScalars(hexToHsv(hexColor));

    this.setState(
    {
      hue: Math.round(hsvColor[0]),
      sat: Math.round(hsvColor[1]),
      val: Math.round(hsvColor[2])
    });

    if (this.props.onChange)
    {
      this.triggerParentOnChange(hexColor, false);
    }
  }
  setHex(e: Event)
  {
    e.stopPropagation();
    e.preventDefault();

    var target = <HTMLInputElement> e.target;

    var hexString: string;
    if (e.type === "paste")
    {
      var e2 = <ClipboardEvent> e;
      hexString = e2.clipboardData.getData("text");
    }
    else
    {
      hexString = target.value;
    }

    if (hexString[0] !== "#")
    {
      hexString = "#" + hexString;
    }
    var isValid = /^#[0-9A-F]{6}$/i.test(hexString);

    var hexColor = stringToHex(hexString);


    this.setState(
    {
      hexString: hexString,
      lastValidHexString: isValid ? hexString : this.state.lastValidHexString,
      hexColor: isValid ? hexColor : this.state.hexColor,
      isNull: !isValid
    });

    if (isValid)
    {
      this.updateFromHex(hexColor);
    }

  }
  setHue(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var hue = Math.round(parseInt(target.value) % 361);
    if (hue < 0) hue = 360;
    this.setState({hue: hue});
    this.updateFromHsv(hue, this.state.sat, this.state.val, e);
  }
  setSat(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var sat = Math.round(parseInt(target.value) % 101);
    if (sat < 0) sat = 100;
    this.setState({sat: sat});
    this.updateFromHsv(this.state.hue, sat, this.state.val, e);
  }
  setVal(e: Event)
  {
    var target = <HTMLInputElement> e.target;
    var val = Math.round(parseInt(target.value) % 101);
    if (val < 0) val = 100;
    this.setState({val: val});
    this.updateFromHsv(this.state.hue, this.state.sat, val, e);
  }

  autoGenerateColor()
  {
    var hexColor = this.props.generateColor();
    var hexString = "#" + hexToString(hexColor);

    this.setState(
    {
      hexString: hexString,
      lastValidHexString: hexString,
      hexColor: hexColor
    });

    this.updateFromHex(hexColor);
  }

  nullifyColor()
  {
    this.setState({isNull: true});

    if (this.props.onChange)
    {
      this.triggerParentOnChange(this.state.hexColor, true);
    }
  }

  getHueGradientString()
  {
    if (this.hueGradientString) return this.hueGradientString;

    var steps = 10;
    var gradeStep = 100 / (steps - 1);
    var hueStep = 360 / steps;

    var gradientString = "linear-gradient(to right, ";

    for (var i = 0; i < steps; i++)
    {
      var hue = hueStep * i;
      var grade = gradeStep * i;
      var colorString = "hsl(" + hue + ", 100%, 50%) " + grade + "%";
      if (i < steps - 1)
      {
        colorString += ",";
      }
      else
      {
        colorString += ")";
      }

      gradientString += colorString;
    }

    this.hueGradientString = gradientString;
    return gradientString;
  }

  makeGradientString(min: string, max: string)
  {
    return(
      "linear-gradient(to right, " +
      min + " 0%, " +
      max + " 100%)"
    );
  }

  makeGradientStyle(type: string)
  {
    var hue = this.state.hue;
    var sat = this.state.sat;
    var val = this.state.val;

    switch (type)
    {
      case "hue":
      {
        return(
        {
          background: this.getHueGradientString()
        });
      }
      case "sat":
      {
        var min = "#" + hexToString(hsvToHex.apply(null, scalarsFromColor([hue, 0, val])));
        var max = "#" + hexToString(hsvToHex.apply(null, scalarsFromColor([hue, 100, val])));
        return(
        {
          background: this.makeGradientString(min, max)
        });
      }
      case "val":
      {
        var min = "#" + hexToString(hsvToHex.apply(null, scalarsFromColor([hue, sat, 0])));
        var max = "#" + hexToString(hsvToHex.apply(null, scalarsFromColor([hue, sat, 100])));
        return(
        {
          background: this.makeGradientString(min, max)
        });
      }
      default:
      {
        return null;
      }
    }
  }

  makeHsvInputs(type: string)
  {
    var rootId = this._rootNodeID;
    var label = "" + type[0].toUpperCase() + ":";

    var max = type === "hue" ? 360 : 100;
    var updateFunctions =
    {
      hue: this.setHue,
      sat: this.setSat,
      val: this.setVal
    };

    return(
      React.DOM.div({className: "color-picker-input-container", key: type},
        React.DOM.label({className: "color-picker-label", htmlFor: "" + rootId + type}, label),
        React.DOM.div(
        {
          className: "color-picker-slider-background",
          style: this.makeGradientStyle(type)
        },
          React.DOM.input(
          {
            className: "color-picker-slider",
            id: "" + rootId + type,
            ref: type,
            type: "range",
            min: 0,
            max: max,
            step: 1,
            value: this.state[type],
            onChange: updateFunctions[type],
            onMouseUp: updateFunctions[type],
            onTouchEnd: updateFunctions[type]
          })
        ),
        React.DOM.input(
        {
          className: "color-picker-input",
          type: "number",
          step: 1,
          value: "" + Math.round(this.state[type]),
          onChange: updateFunctions[type]
        })
      )
    );
  }
  render()
  {
    var rootId = this._rootNodeID;

    return(
      React.DOM.div({className: "color-picker"},
        React.DOM.div({className: "color-picker-hsv"},
          this.makeHsvInputs("hue"),
          this.makeHsvInputs("sat"),
          this.makeHsvInputs("val")
        ),
        React.DOM.div({className: "color-picker-input-container", key: "hex"},
          React.DOM.label({className: "color-picker-label", htmlFor: "" + rootId + "hex"}, "Hex:"),
          /*React.DOM.input(
          {
            className: "color-picker-slider",
            id: "" + rootId + "hex",
            ref: "hex",
            type: "color",
            step: 1,
            value: this.state.lastValidHexString,
            onChange: this.setHex
          }),*/
          !this.props.generateColor ? null :
          React.DOM.button(
          {
            className: "color-picker-button",
            onClick: this.autoGenerateColor
          }, "Auto"),
          React.DOM.button(
          {
            className: "color-picker-button",
            onClick: this.nullifyColor
          }, "Clear"),
          React.DOM.input(
          {
            className: "color-picker-input color-picker-input-hex",
            ref: "hex",
            type: "string",
            step: 1,
            value: this.state.hexString,
            onChange: this.setHex,
            onPaste: this.setHex
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ColorPicker_COMPONENT_TODO);
export default Factory;
