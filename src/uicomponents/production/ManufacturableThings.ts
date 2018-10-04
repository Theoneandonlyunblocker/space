import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import Player from "../../Player";
import Star from "../../Star";
import ItemTemplate from "../../templateinterfaces/ItemTemplate";
import UnitTemplate from "../../templateinterfaces/UnitTemplate";

import ManufacturableItems from "./ManufacturableItems";
import ManufacturableUnits from "./ManufacturableUnits";


type TabKey = "units" | "items";

export interface PropTypes extends React.Props<any>
{
  selectedStar: Star | null;
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

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "manufacturable-things",
      },
        ReactDOMElements.div(
        {
          className: "manufacturable-things-tab-buttons",
        },
          this.makeTabButton("units"),
          this.makeTabButton("items"),
        ),
        ReactDOMElements.div(
        {
          className: "manufacturable-things-active-tab",
        },
          this.makeTab(this.state.activeTab),
        ),
      )
    );
  }

  private bindMethods(): void
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

  private selectTab(key: TabKey): void
  {
    if (this.state.activeTab === key) { return; }
    this.setState(
    {
      activeTab: key,
    });
  }
  private makeTabButton(key: TabKey): React.ReactHTMLElement<HTMLButtonElement>
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
      ReactDOMElements.button(
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
  private getManufacturableThings(key: TabKey): ItemTemplate[] | UnitTemplate[]
  {
    if (!this.props.selectedStar || !this.props.selectedStar.manufactory)
    {
      return [];
    }

    if (key === "items")
    {
      return this.props.selectedStar.manufactory.getManufacturableItems();
    }
    else
    {
      return this.props.selectedStar.manufactory.getManufacturableUnits();
    }
  }
  private makeTab(key: TabKey)
  {
    const props =
    {
      key: key,
      selectedStar: this.props.selectedStar,
      manufacturableThings: this.getManufacturableThings(key),
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
}

const factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsComponent);
export default factory;
