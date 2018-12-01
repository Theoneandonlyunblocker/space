import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Player from "../../Player";
import PlayerFlag from "../PlayerFlag";


export interface PropTypes extends React.Props<any>
{
  evaluation: number;
  // TODO 2018.11.30 | use react motion
  animationDuration: number;

  player1: Player;
  player2: Player;
}

interface StateType
{
}

export class BattleScoreComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "BattleScore";
  lastEvaluation: number;
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  render()
  {
    const evaluationPercentage = 50 + this.props.evaluation * 50;
    const transitionDurationString = `${this.props.animationDuration}ms`;

    return(
      ReactDOMElements.div(
      {
        className: "battle-score-wrapper",
      },
        ReactDOMElements.div(
        {
          className: "battle-score-container",
        },
          ReactDOMElements.img(
          {
            className: "battle-score-mid-point",
            src: "img/icons/battleScoreMidPoint.png",
          },
            null,
          ),
          PlayerFlag(
          {
            props:
            {
              className: "battle-score-flag",
            },
            flag: this.props.player1.flag,
          }),
          ReactDOMElements.div(
          {
            className: "battle-score-bar-container",
          },
            ReactDOMElements.div(
            {
              className: "battle-score-bar-value battle-score-bar-side1",
              style:
              {
                width: `${evaluationPercentage}%`,
                backgroundColor: "#" + this.props.player1.color.getHexString(),
                borderColor: "#" + this.props.player1.secondaryColor.getHexString(),
                transitionDuration: transitionDurationString,
              },
            }),
            ReactDOMElements.div(
            {
              className: "battle-score-bar-value battle-score-bar-side2",
              style:
              {
                width: `${100 - evaluationPercentage}%`,
                backgroundColor: "#" + this.props.player2.color.getHexString(),
                borderColor: "#" + this.props.player2.secondaryColor.getHexString(),
                transitionDuration: transitionDurationString,
              },
            }),
          ),
          PlayerFlag(
          {
            props:
            {
              className: "battle-score-flag",
            },
            flag: this.props.player2.flag,
          }),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BattleScoreComponent);
export default factory;
