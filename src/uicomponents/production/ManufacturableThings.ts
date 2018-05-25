import * as React from "react";

import Player from "../../Player";
import Star from "../../Star";
import ManufacturableItems from "./ManufacturableItems";
import ManufacturableUnits from "./ManufacturableUnits";

import {localize} from "../../../localization/localize";


type TabKey = "units" | "items";

export interface PropTypes extends React.Props<any>
{
  selectedStar?: Star;
  player: Player;
  triggerUpdate: () => void;
  money: number;
}

interface StateType
{
  activeTab: TabKey;
}

export class ManufacturableThingsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableThings";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeTabButton = this.makeTabButton.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.makeTab = this.makeTab.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      activeTab: "units",
    });
  }

  selectTab(key: TabKey)
  {
    if (this.state.activeTab === key) return;
    this.setState(
    {
      activeTab: key,
    });
  }

  makeTabButton(key: TabKey)
  {
    let displayString: string;
    switch (key)
    {
      case "units":
      {
        displayString = localize("manufactureUnitsButton")();
        break;
      }
      case "items":
      {
        displayString = localize("manufactureItemsButton")();
        break;
      }
    }

    return(
      React.DOM.button(
      {
        key: key,
        className: "manufacturable-things-tab-button" +
          (this.state.activeTab === key ? " active-tab" : ""),
        onClick: this.selectTab.bind(this, key),
      },
        displayString!,
      )
    );
  }

  makeTab(key: TabKey)
  {
    const props =
    {
      key: key,
      selectedStar: this.props.selectedStar,
      manufacturableThings: key === "items" ?
        this.props.selectedStar.manufactory.getManufacturableItems() :
        this.props.selectedStar.manufactory.getManufacturableUnits(),
      consolidateLocations: false,
      triggerUpdate: this.props.triggerUpdate,
      canBuild: Boolean(this.props.selectedStar && this.props.selectedStar.manufactory),
      money: this.props.money,
    };
    switch (key)
    {
      case "units":
      {
        return(
          ManufacturableUnits(props)
        );
      }
      case "items":
      {
        props.consolidateLocations = true;

        return(
          ManufacturableItems(props)
        );
      }
    }
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "manufacturable-things",
      },
        React.DOM.div(
        {
          className: "manufacturable-things-tab-buttons",
        },
          this.makeTabButton("units"),
          this.makeTabButton("items"),
        ),
        React.DOM.div(
        {
          className: "manufacturable-things-active-tab",
        },
          this.makeTab(this.state.activeTab),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsComponent);
export default Factory;
