/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../playerflag.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class BattleScore extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleScore";
  lastEvaluation: reactTypeTODO_any = undefined;
  shouldComponentUpdate(newProps: any)
  {
    var oldEvaluation = this.lastEvaluation;
    this.lastEvaluation = newProps.battle.getEvaluation();

    return this.lastEvaluation !== oldEvaluation;
  }
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentWillMount()
  {
    this.lastEvaluation = this.props.battle.getEvaluation();
  }
  render()
  {
    var battle: Battle = this.props.battle;
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
            src: "img\/icons\/battleScoreMidPoint.png"
          },
            null
          ),
          UIComponents.PlayerFlag(
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
                backgroundColor: "#" + hexToString(battle.side1Player.color),
                borderColor: "#" + hexToString(battle.side1Player.secondaryColor)
              }
            }),
            React.DOM.div(
            {
              className: "battle-score-bar-value battle-score-bar-side2",
              style:
              {
                width: "" + (100 - evaluationPercentage) + "%",
                backgroundColor: "#" + hexToString(battle.side2Player.color),
                borderColor: "#" + hexToString(battle.side2Player.secondaryColor)
              }
            })
          ),
          UIComponents.PlayerFlag(
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
