import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";


export enum AnimationState
{
  RemoveDeadUnit,
  FillSpaceLeftByDeadUnits,
  RemoveUnit,
  ClearSpaceForUnit,
  InsertUnit,
  PushUnit,
  Idle,
}

const containerClassForAnimationState =
{
  [AnimationState.RemoveDeadUnit]: "remove-dead-unit",
  [AnimationState.FillSpaceLeftByDeadUnits]: "fill-space-left-by-dead-unit",
  [AnimationState.RemoveUnit]: "remove-unit",
  [AnimationState.ClearSpaceForUnit]: "clear-space-for-unit",
  [AnimationState.InsertUnit]: "insert-unit",
  [AnimationState.PushUnit]: "push-unit",
  [AnimationState.Idle]: "",
};

export interface PropTypes extends React.Props<any>
{
  unitName: string;
  delay: number;
  isFriendly: boolean;
  isHovered: boolean;

  animationState: AnimationState;
  transitionDuration: number;

  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
}

interface StateType
{
}

export class TurnOrderUnitComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "TurnOrderUnit";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    let additionalUnitClasses = "";
    if (this.props.isFriendly)
    {
      additionalUnitClasses += " turn-order-unit-friendly";
    }
    else
    {
      additionalUnitClasses += " turn-order-unit-enemy";
    }
    if (this.props.isHovered)
    {
      additionalUnitClasses += " turn-order-unit-hover";
    }

    return(
      ReactDOMElements.div(
      {
        className: "turn-order-unit-container" + " " +
          containerClassForAnimationState[this.props.animationState],
        style:
        {
          animationDuration: "" + this.props.transitionDuration + "ms",
        },
      },
        ReactDOMElements.div(
        {
          className: "turn-order-unit" + additionalUnitClasses,
          style:
          {
            animationDuration: "" + this.props.transitionDuration + "ms",
          },
          title: localize("delay_tooltip").format(this.props.delay),
          onMouseEnter: this.props.onMouseEnter,
          onMouseLeave: this.props.onMouseLeave,
        },
          this.props.unitName,
        ),
      )
    );
  }
}

export const TurnOrderUnit: React.Factory<PropTypes> = React.createFactory(TurnOrderUnitComponent);
