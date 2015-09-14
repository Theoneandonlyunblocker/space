module Rance
{
  export module UIComponents
  {
    export var BattleScore = React.createClass(
    {
      displayName: "BattleScore",
      lastEvaluation: undefined,
      shouldComponentUpdate: function(newProps: any)
      {
        if (!isFinite(this.lastEvaluation))
        {
          this.lastEvaluation = newProps.battle.getEvaluation();
          return true;
        }
        else 
        {
          var oldEvaluation = this.lastEvaluation;
          this.lastEvaluation = newProps.battle.getEvaluation();
          return this.lastEvaluation !== oldEvaluation;
        }
      },
      render: function()
      {
        var battle = this.props.battle;
        var evaluation = this.lastEvaluation;

        var evaluationPercentage = ((1 - evaluation) * 50);

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
              React.DOM.div(
              {
                className: "battle-score-flag-wrapper",
                style:
                {
                  backgroundImage: "url(" + battle.side1Player.icon + ")"
                }
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
                    width: "" + (100 - evaluationPercentage) + "%",
                    backgroundColor: "#" + hexToString(battle.side1Player.color),
                    borderColor: "#" + hexToString(battle.side1Player.secondaryColor)
                  }
                }),
                React.DOM.div(
                {
                  className: "battle-score-bar-value battle-score-bar-side2",
                  style:
                  {
                    width: "" + evaluationPercentage + "%",
                    backgroundColor: "#" + hexToString(battle.side2Player.color),
                    borderColor: "#" + hexToString(battle.side2Player.secondaryColor)
                  }
                })
              ),
              React.DOM.div(
              {
                className: "battle-score-flag-wrapper",
                style:
                {
                  backgroundImage: "url(" + battle.side2Player.icon + ")"
                }
              })
            )
          )
        );
      }
    });
  }
}