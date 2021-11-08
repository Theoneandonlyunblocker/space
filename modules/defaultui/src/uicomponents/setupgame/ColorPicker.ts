import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Color} from "core/src/color/Color";
import {NumberInput} from "../generic/NumberInput";
import
{
  AutoPositionerProps,
  AutoPositioner,
} from "../mixins/AutoPositioner";
import {applyMixins} from "../mixins/applyMixins";

import {ColorPickerSlider} from "./ColorPickerSlider";


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
  hexColor: number;
  hue: number;
  val: number;
  sat: number;
}

export class ColorPickerComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "ColorPicker";
  public state: StateType;

  private onChangeTimeoutHandle: number = null;
  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this, this.ownDOMNode));
    }

    const initialColor = this.props.initialColor || new Color(1, 1, 1);
    this.state = this.getStateFromColor(initialColor);

    this.bindMethods();
  }

  public render()
  {
    return(
      ReactDOMElements.div({className: "color-picker", ref: this.ownDOMNode},
        ReactDOMElements.div({className: "color-picker-hsv"},
          this.makeHsvInputs("hue"),
          this.makeHsvInputs("sat"),
          this.makeHsvInputs("val"),
        ),
        ReactDOMElements.div({className: "color-picker-input-container", key: "hex"},
          ReactDOMElements.label({className: "color-picker-label"}, "Hex:"),
          !this.props.generateColor ? null :
            ReactDOMElements.button(
            {
              className: "color-picker-button",
              onClick: this.autoGenerateColor,
            }, localize("auto").toString()),
          !this.props.isNullable ? null :
            ReactDOMElements.button(
            {
              className: "color-picker-button",
              onClick: this.nullifyColor,
            }, localize("clear").toString()),
          NumberInput(
          {
            noSpinner: true,
            attributes:
            {
              className: "color-picker-input",
            },
            value: this.state.hexColor,
            valueStringIsValid: valueString =>
            {
              return /^#*[0-9A-F]{6}$/i.test(valueString);
            },
            stylizeValue: value =>
            {
              return "#" + Color.fromHex(value).getHexString();
            },
            getValueFromValueString: valueString =>
            {
              return Color.fromHexString(valueString).getHex();
            },
            onChange: value =>
            {
              this.setState(
              {
                hexColor: value,
              });

              this.updateFromHex(value);
            },
          }),
        ),
      )
    );
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
  private getStateFromColor(color: Color): StateType
  {
    const hsvColor = Color.convertScalarsToDegrees(color.getHSV());

    return(
    {
      hexColor: color.getHex(),
      hue: hsvColor[0],
      sat: hsvColor[1],
      val: hsvColor[2],
    });
  }
  private triggerParentOnChange(color: Color, isNull: boolean)
  {
    if (this.onChangeTimeoutHandle)
    {
      clearTimeout(this.onChangeTimeoutHandle);
      this.onChangeTimeoutHandle = null;
    }

    if (this.props.minUpdateBuffer)
    {
      this.onChangeTimeoutHandle = setTimeout(() =>
      {
      }, this.props.minUpdateBuffer || 0);
    }
    else
    {
      this.props.onChange(color, isNull);
    }
  }
  private updateFromHsv(hue: number, sat: number, val: number, e?: Event)
  {
    if (e && e.type !== "change")
    {
      return;
    }

    const color = Color.fromHSV(...Color.convertDegreesToScalars([hue, sat, val]));

    this.setState(
    {
      hexColor: color.getHex(),
    });

    if (this.props.onChange)
    {
      this.triggerParentOnChange(color, false);
    }
  }
  private updateFromHex(hexColor: number)
  {
    const color = Color.fromHex(hexColor);
    const hsvColor = Color.convertScalarsToDegrees(color.getHSV());

    this.setState(
    {
      hue: Math.round(hsvColor[0]),
      sat: Math.round(hsvColor[1]),
      val: Math.round(hsvColor[2]),
    });

    if (this.props.onChange)
    {
      this.triggerParentOnChange(color, false);
    }
  }
  private setHue(hue: number)
  {
    this.setState({hue: hue});
    this.updateFromHsv(hue, this.state.sat, this.state.val);
  }
  private setSat(sat: number)
  {
    this.setState({sat: sat});
    this.updateFromHsv(this.state.hue, sat, this.state.val);
  }
  private setVal(val: number)
  {
    this.setState({val: val});
    this.updateFromHsv(this.state.hue, this.state.sat, val);
  }
  private autoGenerateColor()
  {
    const color = this.props.generateColor();
    const hexColor = color.getHex();

    this.setState(
    {
      hexColor: hexColor,
    });

    this.updateFromHex(hexColor);
  }
  private nullifyColor()
  {
    if (this.props.onChange)
    {
      this.triggerParentOnChange(Color.fromHex(this.state.hexColor), true);
    }
  }
  private makeGradientString(min: string, max: string)
  {
    return(
      "linear-gradient(to right, " +
      min + " 0%, " +
      max + " 100%)"
    );
  }
  private makeHexStringFromHSVDegreeArray(hsv: [number, number, number])
  {
    const color = Color.fromHSV(...Color.convertDegreesToScalars(hsv));

    return color.getHexString();
  }
  private makeGradientStyle(type: "hue" | "sat" | "val"): string
  {
    const hue = this.state.hue;
    const sat = this.state.sat;
    const val = this.state.val;

    switch (type)
    {
      case "hue":
      {
        return "linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)";
      }
      case "sat":
      {
        const min = "#" + this.makeHexStringFromHSVDegreeArray([hue, 0, val]);
        const max = "#" + this.makeHexStringFromHSVDegreeArray([hue, 100, val]);

        return this.makeGradientString(min, max);
      }
      case "val":
      {
        const min = "#" + this.makeHexStringFromHSVDegreeArray([hue, sat, 0]);
        const max = "#" + this.makeHexStringFromHSVDegreeArray([hue, sat, 100]);

        return this.makeGradientString(min, max);
      }
    }
  }
  private makeHsvInputs(type: "hue" | "sat" | "val")
  {
    const label = `${type[0].toUpperCase()}:`;

    const max = type === "hue" ? 360 : 100;
    const updateFunctions =
    {
      hue: this.setHue,
      sat: this.setSat,
      val: this.setVal,
    };

    return(
      ReactDOMElements.div({className: "color-picker-input-container", key: type},
        ReactDOMElements.label({className: "color-picker-label"}, label),
        ColorPickerSlider(
        {
          value: this.state[type],
          max: max,
          onChange: updateFunctions[type],

          backgroundStyle: this.makeGradientStyle(type),
        }),
        NumberInput(
        {
          attributes:
          {
            className: "color-picker-input",
          },
          value: this.state[type],
          onChange: updateFunctions[type],

          min: 0,
          max: max,
          step: 1,
          canWrap: type === "hue",
        }),
      )
    );
  }
}

export const ColorPicker: React.Factory<PropTypes> = React.createFactory(ColorPickerComponent);
