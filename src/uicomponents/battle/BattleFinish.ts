/// <reference path="../../../lib/react-global.d.ts" />

export interface PropTypes extends React.Props<any>
{
  humanPlayerWonBattle: boolean;
}

interface StateType
{
}

export class BattleFinishComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "BattleFinish";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "battle-scene-finish-container",
      },
        React.DOM.h1(
        {
          className: "battle-scene-finish-header",
        },
          this.props.humanPlayerWonBattle ? "You win" : "You lose",
        ),
        React.DOM.h3(
        {
          className: "battle-scene-finish-subheader",
        },
          "Click anywhere to continue",
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleFinishComponent);
export default Factory;
