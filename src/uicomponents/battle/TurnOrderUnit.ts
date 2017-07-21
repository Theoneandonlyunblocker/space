/// <reference path="../../../lib/react-global.d.ts" />

import {localize} from "../../../localization/localize";


export enum AnimationState
{
  removeDeadUnit,
  fillSpaceLeftByDeadUnits,
  removeUnit,
  clearSpaceForUnit,
  insertUnit,
  pushUnit,
  idle,
}

interface PropTypes extends React.Props<any>
{
  unitName: string;
  delay: number;
  isFriendly: boolean;
  isHovered: boolean;

  animationState: AnimationState;
  transitionDuration: number;

  onMouseLeave: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
}

interface StateType
{
}

export class TurnOrderUnitComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "TurnOrderUnit";
  state: StateType;
  containerClassForAnimationState =
  {
    [AnimationState.removeDeadUnit]: "remove-dead-unit",
    [AnimationState.fillSpaceLeftByDeadUnits]: "fill-space-left-by-dead-unit",
    [AnimationState.removeUnit]: "remove-unit",
    [AnimationState.clearSpaceForUnit]: "clear-space-for-unit",
    [AnimationState.insertUnit]: "insert-unit",
    [AnimationState.pushUnit]: "push-unit",
    [AnimationState.idle]: "",
  };

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
      React.DOM.div(
      {
        className: "turn-order-unit-container" + " " +
          this.containerClassForAnimationState[this.props.animationState],
        style:
        {
          animationDuration: "" + this.props.transitionDuration + "ms",
        },
      },
        React.DOM.div(
        {
          className: "turn-order-unit" + additionalUnitClasses,
          style:
          {
            animationDuration: "" + this.props.transitionDuration + "ms",
          },
          title: localize("delay_turnOrder") + ": " + this.props.delay,
          onMouseEnter: this.props.onMouseEnter,
          onMouseLeave: this.props.onMouseLeave,
        },
          this.props.unitName,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TurnOrderUnitComponent);
export default Factory;
