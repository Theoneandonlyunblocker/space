import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Unit} from "core/src/unit/Unit";

import {UpgradeAbilities} from "./UpgradeAbilities";
import {UpgradeAttributes} from "./UpgradeAttributes";


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
      ReactDOMElements.div(
      {
        className: "upgrade-unit",
      },
        ReactDOMElements.div(
        {
          className: "upgrade-unit-header",
        },
          localize("unitUpgradeHeader").format(
          {
            unitName: this.props.unit.name.toString(),
            currentLevel: this.props.unit.level,
            nextLevel: this.props.unit.level + 1,
          }),
        ),
        UpgradeAbilities(
        {
          unit: this.props.unit,
          upgradableAbilitiesData: this.props.unit.getCurrentUpgradableAbilitiesData(),
          learnableAbilities: this.props.unit.getCurrentLearnableAbilities(),
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

export const UpgradeUnit: React.Factory<PropTypes> = React.createFactory(UpgradeUnitComponent);