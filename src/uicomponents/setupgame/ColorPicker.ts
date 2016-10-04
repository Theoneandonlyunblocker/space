/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";

import ControlledNumberInput from "../generic/ControlledNumberInput";
import
{
  default as AutoPositioner,
  AutoPositionerProps
} from "../mixins/AutoPositioner";
import applyMixins from "../mixins/applyMixins";

export interface PropTypes extends React.Props<any>
{
  generateColor?: () => Color;
  initialColor: Color | null;
  onChange: (color: Color, isNull: boolean) => void;
  minUpdateBuffer?: number;
  isNullable?: boolean;

  autoPositionerProps?: AutoPositionerProps;
}

interface StateType
{
  hexColor?: number;
  hue?: number;
  val?: number;
  sat?: number;
}

export class ColorPickerComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ColorPicker";
  state: StateType;

  private onChangeTimeoutHandle: number = null;
  private baseElementID: string = "color-picker"; 

  constructor(props: PropTypes)
  {
    super(props);

    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this));
    }
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.setHue = this.setHue.bind(this);
    this.setSat = this.setSat.bind(this);
    this.makeHsvInputs = this.makeHsvInputs.bind(this);
    this.autoGenerateColor = this.autoGenerateColor.bind(this);
    this.updateFromHex = this.updateFromHex.bind(this);
    this.updateFromHsv = this.updateFromHsv.bind(this);
    this.makeGradientStyle = this.makeGradientStyle.bind(this);
    this.triggerParentOnChange = this.triggerParentOnChange.bind(this);
    this.setVal = this.setVal.bind(this);
    this.makeGradientString = this.makeGradientString.bind(this);
    this.nullifyColor = this.nullifyColor.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    const color = this.props.initialColor || new Color(1, 1, 1);
    const hsvColor = Color.convertScalarsToDegrees(color.getHSV());

    return(
    {
      hexColor: color.getHex(),
      hue: hsvColor[0],
      sat: hsvColor[1],
      val: hsvColor[2]
    });
  }

  triggerParentOnChange(color: Color, isNull: boolean)
  {
    if (this.onChangeTimeoutHandle)
    {
      window.clearTimeout(this.onChangeTimeoutHandle);
      this.onChangeTimeoutHandle = null;
    }

    if (this.props.minUpdateBuffer)
    {
      this.onChangeTimeoutHandle = window.setTimeout(() =>
      {
      }, this.props.minUpdateBuffer || 0);
    }
    else
    {
      this.props.onChange(color, isNull);
    }
  }

  updateFromHsv(hue: number, sat: number, val: number, e?: Event)
  {
    if (e && e.type !== "change")
    {
      return;
    }
    
    const color: Color = Color.fromHSV.apply(null, Color.convertDegreesToScalars([hue, sat, val]));

    this.setState(
    {
      hexColor: color.getHex(),
    });

    if (this.props.onChange)
    {
      this.triggerParentOnChange(color, false);
    }
  }
  updateFromHex(hexColor: number)
  {
    const color = Color.fromHex(hexColor);
    const hsvColor = Color.convertScalarsToDegrees(color.getHSV());

    this.setState(
    {
      hue: Math.round(hsvColor[0]),
      sat: Math.round(hsvColor[1]),
      val: Math.round(hsvColor[2])
    });

    if (this.props.onChange)
    {
      this.triggerParentOnChange(color, false);
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
    const color = this.props.generateColor();
    const hexColor = color.getHex();

    this.setState(
    {
      hexColor: hexColor
    });

    this.updateFromHex(hexColor);
  }

  nullifyColor()
  {
    if (this.props.onChange)
    {
      this.triggerParentOnChange(Color.fromHex(this.state.hexColor), true);
    }
  }

  makeGradientString(min: string, max: string)
  {
    return(
      "linear-gradient(to right, " +
      min + " 0%, " +
      max + " 100%)"
    );
  }
  
  private makeHexStringFromHSVDegreeArray(hsv: number[])
  {
    const color: Color = Color.fromHSV.apply(null, Color.convertDegreesToScalars(hsv));
    return color.getHexString();
  }

  makeGradientStyle(type: string): React.CSSProperties
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

        });
      }
      case "sat":
      {
        var min = "#" + this.makeHexStringFromHSVDegreeArray([hue, 0, val]);
        var max = "#" + this.makeHexStringFromHSVDegreeArray([hue, 100, val]);
        return(
        {
          background: this.makeGradientString(min, max)
        });
      }
      case "val":
      {
        var min = "#" + this.makeHexStringFromHSVDegreeArray([hue, sat, 0]);
        var max = "#" + this.makeHexStringFromHSVDegreeArray([hue, sat, 100]);
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
    var label = "" + type[0].toUpperCase() + ":";

    var max = type === "hue" ? 360 : 100;
    var updateFunctions =
    {
      hue: this.setHue,
      sat: this.setSat,
      val: this.setVal
    };

    const idForType = "" + this.baseElementID + "-" + type;

    return(
      React.DOM.div({className: "color-picker-input-container", key: type},
        React.DOM.label({className: "color-picker-label", htmlFor: idForType}, label),
        React.DOM.div(
        {
          className: "color-picker-slider-background" + " color-picker-slider-background-" + type,
          style: this.makeGradientStyle(type)
        },
          React.DOM.input(
          {
            className: "color-picker-slider",
            id: idForType,
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
    return(
      React.DOM.div({className: "color-picker"},
        React.DOM.div({className: "color-picker-hsv"},
          this.makeHsvInputs("hue"),
          this.makeHsvInputs("sat"),
          this.makeHsvInputs("val")
        ),
        React.DOM.div({className: "color-picker-input-container", key: "hex"},
          React.DOM.label({className: "color-picker-label", htmlFor: "" + this.baseElementID + "-hex"}, "Hex:"),
          !this.props.generateColor ? null :
            React.DOM.button(
            {
              className: "color-picker-button",
              onClick: this.autoGenerateColor
            }, "Auto"),
          !this.props.isNullable ? null :
            React.DOM.button(
            {
              className: "color-picker-button",
              onClick: this.nullifyColor
            }, "Clear"),
          ControlledNumberInput(
          {
            className: "color-picker-input color-picker-input-hex",
            value: this.state.hexColor,
            valueStringIsValid: (valueString) =>
            {
              return /^#*[0-9A-F]{6}$/i.test(valueString);
            },
            stylizeValue: (value) =>
            {
              return "#" + Color.fromHex(value).getHexString();
            },
            getValueFromValueString: (valueString) =>
            {
              return Color.fromHexString(valueString).getHex();
            },
            onValueChange: (value) =>
            {
              this.setState(
              {
                hexColor: value
              });

              this.updateFromHex(value);
            }
          }),
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ColorPickerComponent);
export default Factory;
