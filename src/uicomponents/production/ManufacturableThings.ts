/// <reference path="../../../lib/react-global.d.ts" />

import Player from "../../Player";
import ManufacturableItems from "./ManufacturableItems";
import ManufacturableUnits from "./ManufacturableUnits";
import Star from "../../Star";
import ManufacturableThing from "../../templateinterfaces/ManufacturableThing";

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
  activeTab?: TabKey
}

export class ManufacturableThingsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableThings";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makeTabButton = this.makeTabButton.bind(this);
    this.getManufacturableThings = this.getManufacturableThings.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.makeTab = this.makeTab.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      activeTab: "units"
    });
  }

  selectTab(key: TabKey)
  {
    if (this.state.activeTab === key) return;
    this.setState(
    {
      activeTab: key
    });
  }
  
  makeTabButton(key: TabKey)
  {
    var displayString: string;
    switch (key)
    {
      case "units":
      {
        displayString = "Units";
        break;
      }
      case "items":
      {
        displayString = "Items";
        break;
      }
    }

    return(
      React.DOM.button(
      {
        key: key,
        className: "manufacturable-things-tab-button" +
          (this.state.activeTab === key ? " active-tab" : ""),
        onClick: this.selectTab.bind(this, key)
      },
        displayString
      )
    );
  }

  getManufacturableThings(key: TabKey)
  {
    var manufacturableThings: ManufacturableThing[] = [];
    var selectedStar = this.props.selectedStar;
    var player = this.props.player;

    switch (key)
    {
      case "units":
      {
        manufacturableThings = manufacturableThings.concat(player.getGloballyBuildableUnits());
        if (selectedStar)
        {
          if (selectedStar.manufactory)
          {
            manufacturableThings = manufacturableThings.concat(
              selectedStar.manufactory.getLocalUnitTypes().manufacturable);
          }
        }
        break;
      }
      case "items":
      {
        manufacturableThings = manufacturableThings.concat(player.getGloballyBuildableItems());
        if (selectedStar)
        {
          if (selectedStar.manufactory)
          {
            manufacturableThings = manufacturableThings.concat(
              selectedStar.manufactory.getLocalItemTypes().manufacturable);
          }
        }
        break;
      }
    }

    return manufacturableThings;
  }

  makeTab(key: TabKey)
  {
    var props =
    {
      key: key,
      selectedStar: this.props.selectedStar,
      manufacturableThings: this.getManufacturableThings(key),
      consolidateLocations: false,
      triggerUpdate: this.props.triggerUpdate,
      canBuild: Boolean(this.props.selectedStar && this.props.selectedStar.manufactory),
      money: this.props.money
    }
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
        className: "manufacturable-things"
      },
        React.DOM.div(
        {
          className: "manufacturable-things-tab-buttons"
        },
          this.makeTabButton("units"),
          this.makeTabButton("items")
        ),
        React.DOM.div(
        {
          className: "manufacturable-things-active-tab"
        },
          this.makeTab(this.state.activeTab)
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsComponent);
export default Factory;
