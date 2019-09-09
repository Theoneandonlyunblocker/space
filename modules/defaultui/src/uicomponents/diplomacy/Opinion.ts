import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AttitudeModifier} from "core/src/diplomacy/AttitudeModifier";
import
{
  clamp,
  getRelativeValue,
} from "core/src/generic/utility";

import {AttitudeModifierList} from "./AttitudeModifierList";


export interface PropTypes extends React.Props<any>
{
  attitudeModifiers: AttitudeModifier[];
  opinion: number;
}

interface StateType
{
  hasAttitudeModifierTootlip: boolean;
}

export class OpinionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Opinion";
  public state: StateType;

  private readonly opinionTextNode = React.createRef<HTMLSpanElement>();

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.getColor = this.getColor.bind(this);
    this.getOpinionTextNodeRect = this.getOpinionTextNodeRect.bind(this);
    this.setTooltip = this.setTooltip.bind(this);
    this.clearTooltip = this.clearTooltip.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      hasAttitudeModifierTootlip: false,
    });
  }

  setTooltip()
  {
    this.setState({hasAttitudeModifierTootlip: true});
  }

  clearTooltip()
  {
    this.setState({hasAttitudeModifierTootlip: false});
  }

  getOpinionTextNodeRect()
  {
    return this.opinionTextNode.current.getBoundingClientRect();
  }

  getColor()
  {
    let relativeValue = getRelativeValue(this.props.opinion, -30, 30);
    relativeValue = clamp(relativeValue, 0, 1);

    const deviation = Math.abs(0.5 - relativeValue) * 2;

    const hue = 110 * relativeValue;
    let saturation = 0 + 50 * deviation;
    if (deviation > 0.3) { saturation += 40; }
    const lightness = 70 - 20 * deviation;

    return(
      "hsl(" +
        hue + "," +
        saturation + "%," +
        lightness + "%)"
    );
  }

  render()
  {
    let tooltip: React.ReactElement<any> | null = null;
    if (this.state.hasAttitudeModifierTootlip)
    {
      tooltip = AttitudeModifierList(
      {
        attitudeModifiers: this.props.attitudeModifiers,

        autoPositionerProps:
        {
          getParentClientRect: this.getOpinionTextNodeRect,
          positionOnUpdate: true,
          ySide: "outerTop",
          xSide: "outerRight",
          yMargin: 10,
        },
      });
    }

    return(
      ReactDOMElements.div(
      {
        className: "player-opinion",
        onMouseEnter: this.setTooltip,
        onMouseLeave: this.clearTooltip,
      },
        ReactDOMElements.span(
        {
          ref: this.opinionTextNode,
          style:
          {
            color: this.getColor(),
          },
        },
          this.props.opinion,
        ),
        tooltip,
      )
    );
  }
}

export const Opinion: React.Factory<PropTypes> = React.createFactory(OpinionComponent);
