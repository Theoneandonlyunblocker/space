import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {BuildingUpgradeData} from "core/src/building/BuildingUpgradeData";
import {Player} from "core/src/player/Player";

import {UpdateWhenMoneyChanges} from "../mixins/UpdateWhenMoneyChanges";
import {applyMixins} from "../mixins/applyMixins";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  handleUpgrade: (upgradeData: BuildingUpgradeData) => void;
  upgradeData: BuildingUpgradeData;
}

interface StateType
{
  canAfford: boolean;
}

export class BuildingUpgradeListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BuildingUpgradeListItem";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
    applyMixins(this, new UpdateWhenMoneyChanges(this, this.overrideHandleMoneyChange));
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.overrideHandleMoneyChange = this.overrideHandleMoneyChange.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      canAfford: this.props.player.canAfford(this.props.upgradeData.cost),
    });
  }

  overrideHandleMoneyChange()
  {
    this.setState(
    {
      canAfford: this.props.player.canAfford(this.props.upgradeData.cost),
    });
  }

  handleClick()
  {
    this.props.handleUpgrade(this.props.upgradeData);
  }

  render()
  {
    const upgradeData = this.props.upgradeData;

    const rowProps: React.HTMLProps<HTMLTableRowElement> =
    {
      key: upgradeData.template.type,
      className: "building-upgrade-list-item",
      onClick: this.handleClick,
      title: upgradeData.template.description,
    };

    const costProps: React.HTMLProps<HTMLTableCellElement> =
    {
      key: "cost",
      className: "building-upgrade-list-item-cost",
    };

    if (!this.state.canAfford)
    {
      rowProps.onClick = undefined;
      rowProps.disabled = true;
      rowProps.className += " disabled";

      costProps.className += " negative";
    }

    return(
      ReactDOMElements.tr(rowProps,
        ReactDOMElements.td(
        {
          key: "name",
          className: "building-upgrade-list-item-name",
        },
          upgradeData.template.displayName,
        ),
        ReactDOMElements.td(costProps, upgradeData.cost),
      )
    );
  }
}

export const BuildingUpgradeListItem: React.Factory<PropTypes> = React.createFactory(BuildingUpgradeListItemComponent);
