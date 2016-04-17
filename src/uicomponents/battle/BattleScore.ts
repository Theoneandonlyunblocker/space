/// <reference path="../../../lib/react-global.d.ts" />

import Battle from "../../Battle";
import PlayerFlag from "../PlayerFlag";


interface PropTypes extends React.Props<any>
{
  battle: Battle;
}

interface StateType
{
}

export class BattleScoreComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleScore";
  lastEvaluation: number
  shouldComponentUpdate(newProps: PropTypes)
  {
    var oldEvaluation = this.lastEvaluation;
    this.lastEvaluation = newProps.battle.getEvaluation();

    return this.lastEvaluation !== oldEvaluation;
  }
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  componentWillMount()
  {
    this.lastEvaluation = this.props.battle.getEvaluation();
  }
  render()
  {
    var battle = this.props.battle;
    var evaluation = this.lastEvaluation;

    var evaluationPercentage = 50 + evaluation * 50;

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
            flag: battle.side1Player.flag
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
                backgroundColor: "#" + battle.side1Player.color.getHexString(),
                borderColor: "#" + battle.side1Player.secondaryColor.getHexString()
              }
            }),
            React.DOM.div(
            {
              className: "battle-score-bar-value battle-score-bar-side2",
              style:
              {
                width: "" + (100 - evaluationPercentage) + "%",
                backgroundColor: "#" + battle.side2Player.color.getHexString(),
                borderColor: "#" + battle.side2Player.secondaryColor.getHexString()
              }
            })
          ),
          PlayerFlag(
          {
            props:
            {
              className: "battle-score-flag"
            },
            flag: battle.side2Player.flag
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleScoreComponent);
export default Factory;
