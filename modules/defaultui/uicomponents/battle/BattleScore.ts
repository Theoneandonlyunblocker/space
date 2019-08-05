import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactMotion from "react-motion";

import {Player} from "../../../../src/Player";
import {PlayerFlag} from "../PlayerFlag";
import { fixedDurationSpring } from "../../../../src/utility";
import { getAssetSrc } from "../../assets";


export interface PropTypes extends React.Props<any>
{
  evaluation: number;
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
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  render()
  {
    const evaluationPercentage = 50 + this.props.evaluation * 50;

    const p1MainColorString = "#" + this.props.player1.color.getHexString();
    const p1SubColorString = "#" + this.props.player1.secondaryColor.getHexString();
    const p2MainColorString = "#" + this.props.player2.color.getHexString();
    const p2SubColorString = "#" + this.props.player2.secondaryColor.getHexString();

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
            src: getAssetSrc("battleScoreMidPoint"),
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
          React.createElement(ReactMotion.Motion,
          {
            style:
            {
              evaluationPercentage: this.props.animationDuration ?
                fixedDurationSpring(evaluationPercentage, this.props.animationDuration) :
                evaluationPercentage,
            },
            defaultStyle: {evaluationPercentage: evaluationPercentage},
          },
            (interpolatedStyle: {evaluationPercentage: number}) =>
            {
              return ReactDOMElements.div(
              {
                className: "battle-score-bar-container",
              },
                ReactDOMElements.div(
                {
                  className: "battle-score-bar-value battle-score-bar-side1",
                  style:
                  {
                    width: `${interpolatedStyle.evaluationPercentage}%`,
                    backgroundColor: p1MainColorString,
                    borderColor: p1SubColorString,
                  },
                }),
                ReactDOMElements.div(
                {
                  className: "battle-score-bar-value battle-score-bar-side2",
                  style:
                  {
                    width: `${100 - interpolatedStyle.evaluationPercentage}%`,
                    backgroundColor: p2MainColorString,
                    borderColor: p2SubColorString,
                  },
                }),
              );
            },
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

export const BattleScore: React.Factory<PropTypes> = React.createFactory(BattleScoreComponent);
