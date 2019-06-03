import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import RampingValue from "../../../../space/battlesfx/drawingfunctions/sfxfragments/RampingValue";
import SfxFragment from "../../../../space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";
import
{
  PropInfoType,
} from "../../../../space/battlesfx/drawingfunctions/sfxfragments/props/PropInfoType";

import Color from "../../../../../src/Color";
import Point from "../../../../../src/Point";
import Range from "../../../../../src/Range";

import SfxFragmentPropColor from "./Color";
import SfxFragmentPropNumber from "./Number";
import SfxFragmentPropPoint from "./Point";
import SfxFragmentPropRampingValue from "./RampingValue";
import SfxFragmentPropRange from "./Range";


export interface PropTypes extends React.Props<any>
{
  propName: string;
  propType: PropInfoType;
  fragment: SfxFragment<any>;
  onPropValueChange: () => void;
}

interface StateType
{
  isCollapsed: boolean;
}

export class SfxFragmentPropComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxFragmentProp";
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

        propValuesElement = SfxFragmentPropNumber(
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

        propValuesElement = SfxFragmentPropPoint(
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

        propValuesElement = SfxFragmentPropColor(
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

        propValuesElement = SfxFragmentPropRange(
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

        propValuesElement = SfxFragmentPropRampingValue(
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
        className: `sfx-fragment-prop sfx-fragment-prop-${this.props.propType}`,
      },
        ReactDOMElements.div(
        {
          className: "sfx-fragment-prop-name-container" + (this.state.isCollapsed ? " collapsed" : " collapsible"),
          onClick: this.toggleCollapsed,
        },
          ReactDOMElements.div(
          {
            className: "sfx-fragment-prop-name",
          },
            this.props.propName,
          ),
        ),
        this.state.isCollapsed ? null : ReactDOMElements.div(
        {
          className: "sfx-fragment-prop-value",
        },
          propValuesElement,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SfxFragmentPropComponent);
export default factory;
