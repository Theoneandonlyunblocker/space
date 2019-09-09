import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {RampingValue} from "modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue";
import {VfxFragment} from "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment";
import
{
  PropInfoType,
} from "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoType";

import {Color} from "core/src/color/Color";
import {Point} from "core/src/math/Point";
import {Range} from "core/src/math/Range";

import {VfxFragmentPropColor} from "./Color";
import {VfxFragmentPropNumber} from "./Number";
import {VfxFragmentPropPoint} from "./Point";
import {VfxFragmentPropRampingValue} from "./RampingValue";
import {VfxFragmentPropRange} from "./Range";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  propType: PropInfoType;
  fragment: VfxFragment<any>;
  onPropValueChange: () => void;
}

interface StateType
{
  isCollapsed: boolean;
}

export class VfxFragmentPropComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxFragmentProp";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isCollapsed: false,
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  private toggleCollapsed(): void
  {
    this.setState(
    {
      isCollapsed: !this.state.isCollapsed,
    });
  }

  render()
  {
    let propValuesElement: React.ReactElement<any>;


    switch (this.props.propType)
    {
      case PropInfoType.Number:
      {
        const propValue: number = this.props.fragment.props[this.props.propName];

        propValuesElement = VfxFragmentPropNumber(
        {
          value: propValue,
          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onPropValueChange,
        });
        break;
      }
      case PropInfoType.Point:
      {
        const propValue: Point = this.props.fragment.props[this.props.propName];

        propValuesElement = VfxFragmentPropPoint(
        {
          x: propValue.x,
          y: propValue.y,

          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onPropValueChange,
        });
        break;
      }
      case PropInfoType.Color:
      {
        const propValue: Color = this.props.fragment.props[this.props.propName];

        propValuesElement = VfxFragmentPropColor(
        {
          color: propValue,

          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onPropValueChange,
        });
        break;
      }
      case PropInfoType.Range:
      {
        const propValue: Range = this.props.fragment.props[this.props.propName];

        propValuesElement = VfxFragmentPropRange(
        {
          min: propValue.min,
          max: propValue.max,

          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onPropValueChange,
        });
        break;
      }
      case PropInfoType.RampingValue:
      {
        const propValue: RampingValue = this.props.fragment.props[this.props.propName];

        propValuesElement = VfxFragmentPropRampingValue(
        {
          base: propValue.base,
          up: propValue.up,
          down: propValue.down,

          propName: this.props.propName,
          fragment: this.props.fragment,
          onValueChange: this.props.onPropValueChange,
        });
        break;
      }
    }

    return(
      ReactDOMElements.div(
      {
        className: `vfx-fragment-prop vfx-fragment-prop-${this.props.propType}`,
      },
        ReactDOMElements.div(
        {
          className: "vfx-fragment-prop-name-container" + (this.state.isCollapsed ? " collapsed" : " collapsible"),
          onClick: this.toggleCollapsed,
        },
          ReactDOMElements.div(
          {
            className: "vfx-fragment-prop-name",
          },
            this.props.propName,
          ),
        ),
        this.state.isCollapsed ? null : ReactDOMElements.div(
        {
          className: "vfx-fragment-prop-value",
        },
          propValuesElement,
        ),
      )
    );
  }
}

export const VfxFragmentProp: React.Factory<PropTypes> = React.createFactory(VfxFragmentPropComponent);
