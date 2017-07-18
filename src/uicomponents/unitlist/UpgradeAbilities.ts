/// <reference path="../../../lib/react-global.d.ts" />

import AbilityBase from "../../templateinterfaces/AbilityBase";
import AbilityList from "./AbilityList";

import {localize} from "../../../localization/unitlist/localize";

export interface PropTypes extends React.Props<any>
{
  sourceAbility?: AbilityBase;
  handleClick: (ability: AbilityBase) => void;
  abilities: AbilityBase[];
  learningNewability?: boolean;
}

interface StateType
{
}

export class UpgradeAbilitiesComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeAbilities";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    if (this.props.abilities.length === 0)
    {
      return null;
    }

    let headerText: string;
    if (this.props.learningNewability)
    {
      headerText = localize("learnAbility");
    }
    else
    {
      headerText = localize("upgradeAbility");
      if (this.props.sourceAbility)
      {
        headerText += " " + this.props.sourceAbility.displayName;
      }
    }

    return(
      React.DOM.div(
      {
        className: "upgrade-abilities",
      },
        React.DOM.div(
        {
          className: "upgrade-abilities-header",
        },
          headerText,
        ),
        AbilityList(
        {
          abilities: this.props.abilities,
          handleClick: this.props.handleClick,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeAbilitiesComponent);
export default Factory;
