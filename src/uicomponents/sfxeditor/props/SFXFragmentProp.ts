/// <reference path="../../../../lib/react-global.d.ts" />

import RampingValue from "../../../../modules/common/battlesfxfunctions/sfxfragments/RampingValue";
import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";
import
{
  PropInfoType,
} from "../../../../modules/common/battlesfxfunctions/sfxfragments/props/PropInfoType";

import Color from "../../../Color";
import Point from "../../../Point";
import Range from "../../../Range";

import SFXFragmentPropColor from "./Color";
import SFXFragmentPropNumber from "./Number";
import SFXFragmentPropPoint from "./Point";
import SFXFragmentPropRampingValue from "./RampingValue";
import SFXFragmentPropRange from "./Range";

interface PropTypes extends React.Props<any>
{
  propName: string;
  propType: PropInfoType;
  fragment: SFXFragment<any>;
  onPropValueChange: () => void;
}

interface StateType
{
  isCollapsed?: boolean;
}

export class SFXFragmentPropComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentProp";
  state: StateType;

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

        propValuesElement = SFXFragmentPropNumber(
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

        propValuesElement = SFXFragmentPropPoint(
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

        propValuesElement = SFXFragmentPropColor(
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

        propValuesElement = SFXFragmentPropRange(
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

        propValuesElement = SFXFragmentPropRampingValue(
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
      React.DOM.div(
      {
        className: `sfx-fragment-prop sfx-fragment-prop-${this.props.propType}`,
      },
        React.DOM.div(
        {
          className: "sfx-fragment-prop-name-container" + (this.state.isCollapsed ? " collapsed" : " collapsible"),
          onClick: this.toggleCollapsed,
        },
          React.DOM.div(
          {
            className: "sfx-fragment-prop-name",
          },
            this.props.propName,
          ),
        ),
        this.state.isCollapsed ? null : React.DOM.div(
        {
          className: "sfx-fragment-prop-value",
        },
          propValuesElement,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropComponent);
export default Factory;
