import * as React from "react";

import Unit from "../../Unit";

import UpgradeAbilities from "./UpgradeAbilities";
import UpgradeAttributes from "./UpgradeAttributes";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  onUnitUpgrade: () => void;
}

interface StateType
{
}

export class UpgradeUnitComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "UpgradeUnit";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }

  public render()
  {
    return(
      React.DOM.div(
      {
        className: "upgrade-unit",
      },
        React.DOM.div(
        {
          className: "upgrade-unit-header",
        },
          localizeF("unitUpgradeHeader").format(
          {
            unitName: this.props.unit.name,
            currentLevel: this.props.unit.level,
            nextLevel: this.props.unit.level + 1,
          }),
        ),
        UpgradeAbilities(
        {
          unit: this.props.unit,
          upgradableAbilitiesData: this.props.unit.getUpgradableAbilitiesData(),
          learnableAbilities: this.props.unit.getLearnableAbilities(),
          onUpgrade: this.props.onUnitUpgrade,
        }),
        UpgradeAttributes(
        {
          unit: this.props.unit,
          handleClick: this.upgradeAttribute,
        }),
      )
    );
  }

  private bindMethods()
  {
    this.upgradeAttribute = this.upgradeAttribute.bind(this);
  }
  private upgradeAttribute(attribute: string)
  {
    const unit = this.props.unit;

    unit.baseAttributes[attribute] += 1;
    unit.attributesAreDirty = true;

    unit.handleLevelUp();
    this.props.onUnitUpgrade();
  }

}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeUnitComponent);
export default Factory;
