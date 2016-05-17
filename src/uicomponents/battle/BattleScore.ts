/// <reference path="../../../lib/react-global.d.ts" />

import PlayerFlag from "../PlayerFlag";
import Player from "../../Player";

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

export class BattleScoreComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleScore";
  lastEvaluation: number;
  state: StateType;
  
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);

  constructor(props: PropTypes)
  {
    super(props);
  }
  render()
  {
    const evaluationPercentage = 50 + this.props.evaluation * 50;
    const transitionDurationString = "" + this.props.animationDuration + "ms";

    return(
      React.DOM.div(
      {
        className: "battle-score-wrapper"
      },
        React.DOM.div(
        {
          className: "battle-score-container"
        },
          React.DOM.img(
          {
            className: "battle-score-mid-point",
            src: "img/icons/battleScoreMidPoint.png"
          },
            null
          ),
          PlayerFlag(
          {
            props:
            {
              className: "battle-score-flag"
            },
            flag: this.props.player1.flag
          }),
          React.DOM.div(
          {
            className: "battle-score-bar-container"
          },
            React.DOM.div(
            {
              className: "battle-score-bar-value battle-score-bar-side1",
              style:
              {
                width: "" + evaluationPercentage + "%",
                backgroundColor: "#" + this.props.player1.color.getHexString(),
                borderColor: "#" + this.props.player1.secondaryColor.getHexString(),
                transitionDuration: transitionDurationString
              }
            }),
            React.DOM.div(
            {
              className: "battle-score-bar-value battle-score-bar-side2",
              style:
              {
                width: "" + (100 - evaluationPercentage) + "%",
                backgroundColor: "#" + this.props.player2.color.getHexString(),
                borderColor: "#" + this.props.player2.secondaryColor.getHexString(),
                transitionDuration: transitionDurationString
              }
            })
          ),
          PlayerFlag(
          {
            props:
            {
              className: "battle-score-flag"
            },
            flag: this.props.player2.flag
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleScoreComponent);
export default Factory;
