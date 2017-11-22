import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  humanPlayerWonBattle: boolean;
}

interface StateType
{
}

import {localize} from "../../../localization/localize";

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
          this.props.humanPlayerWonBattle ?
            localize("battleFinish_victory") :
            localize("battleFinish_loss"),
        ),
        React.DOM.h3(
        {
          className: "battle-scene-finish-subheader",
        },
          localize("battleFinish_clickAnywhereToContinue"),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleFinishComponent);
export default Factory;
