import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  humanPlayerWonBattle: boolean;
}

interface StateType
{
}

export class BattleFinishComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "BattleFinish";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "battle-scene-finish-container",
      },
        ReactDOMElements.h1(
        {
          className: "battle-scene-finish-header",
        },
          this.props.humanPlayerWonBattle ?
            localize("battleFinish_victory")() :
            localize("battleFinish_loss")(),
        ),
        ReactDOMElements.h3(
        {
          className: "battle-scene-finish-subheader",
        },
          localize("battleFinish_clickAnywhereToContinue")(),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BattleFinishComponent);
export default factory;
