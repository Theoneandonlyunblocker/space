/// <reference path="../../player.ts" />
/// <reference path="../mixins/updatewhenmoneychanges.ts" />

export interface PropTypes
{
  player: Player;
  handleUpgrade: reactTypeTODO_func;
  upgradeData: reactTypeTODO_object;
}

export default class BuildingUpgradeListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "BuildingUpgradeListItem";
  mixins: reactTypeTODO_any = [UpdateWhenMoneyChanges];

  getInitialState: function()
  {
    return(
    {
      canAfford: this.props.player.money >= this.props.upgradeData.cost
    });
  }
  
  overrideHandleMoneyChange: function()
  {
    this.setState(
    {
      canAfford: this.props.player.money >= this.props.upgradeData.cost
    })
  }

  handleClick: function()
  {
    this.props.handleUpgrade(this.props.upgradeData);
  }

  render: function()
  {
    var upgradeData: IBuildingUpgradeData = this.props.upgradeData;

    var rowProps: any =
    {
      key: upgradeData.template.type,
      className: "building-upgrade-list-item",
      onClick: this.handleClick,
      title: upgradeData.template.description
    };

    var costProps: any = 
    {
      key: "cost",
      className: "building-upgrade-list-item-cost"
    };

    if (!this.state.canAfford)
    {
      rowProps.onClick = null;
      rowProps.disabled = true;
      rowProps.className += " disabled";

      costProps.className += " negative";
    }

    return(
      React.DOM.tr(rowProps,
        React.DOM.td(
        {
          key: "name",
          className: "building-upgrade-list-item-name"
        }, upgradeData.template.displayName + " " + (upgradeData.level > 1 ? upgradeData.level : "")),
        React.DOM.td(costProps, upgradeData.cost)
      )
    );
  }
}
