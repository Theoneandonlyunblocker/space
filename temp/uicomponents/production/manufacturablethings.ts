/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufacturableunits.ts" />
/// <reference path="manufacturableitems.ts" />

/// <reference path="../../star.ts" />
/// <reference path="../../manufactory.ts" />

export interface PropTypes
{
  selectedStar?: Star;
  player: Player;
  triggerUpdate: reactTypeTODO_func;
  money: number;
}

interface StateType
{
  // TODO refactor | add state type
}

class ManufacturableThings extends React.Component<PropTypes, StateType>
{
  displayName: string = "ManufacturableThings";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      activeTab: "units"
    });
  }

  selectTab(key: string)
  {
    if (this.state.activeTab === key) return;
    this.setState(
    {
      activeTab: key
    });
  }
  
  makeTabButton(key: string)
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

  getManufacturableThings(key: string)
  {
    var manufacturableThings: IManufacturableThing[] = [];
    var selectedStar: Star = this.props.selectedStar;
    var player: Player = this.props.player;

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

  makeTab(key: string)
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
          UIComponents.ManufacturableUnits(props)
        );
      }
      case "items":
      {
        props.consolidateLocations = true;

        return(
          UIComponents.ManufacturableItems(props)
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

const Factory: React.Factory<PropTypes> = React.createFactory(ManufacturableThings);
export default Factory;
