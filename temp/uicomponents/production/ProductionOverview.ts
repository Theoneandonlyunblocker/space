/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="manufactorystarslist.ts" />
/// <reference path="buildqueue.ts" />
/// <reference path="manufacturablethings.ts" />
/// <reference path="constructmanufactory.ts" />

/// <reference path="../mixins/updatewhenmoneychanges.ts" />

/// <reference path="../../player.ts" />
/// <reference path="../../star.ts" />


import BuildQueue from "./BuildQueue.ts";
import Player from "../../Player.ts";
import ManufacturableThings from "./ManufacturableThings.ts";
import Star from "../../Star.ts";
import ConstructManufactory from "./ConstructManufactory.ts";
import ManufactoryStarsList from "./ManufactoryStarsList.ts";
import eventManager from "../../eventManager.ts";


interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
  highlightedStars?: any; // TODO refactor | define state type 456
  money?: any; // TODO refactor | define state type 456
  selectedStar?: any; // TODO refactor | define state type 456
}

export class ProductionOverviewComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ProductionOverview";
  mixins: reactTypeTODO_any = [UpdateWhenMoneyChanges];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.clearSelection = this.clearSelection.bind(this);
    this.getStarsWithAndWithoutManufactories = this.getStarsWithAndWithoutManufactories.bind(this);
    this.handleStarSelect = this.handleStarSelect.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    var initialSelected: Star = null;
    var player = this.props.player;

    var starsByManufactoryPresence = this.getStarsWithAndWithoutManufactories();

    if (starsByManufactoryPresence.withManufactories.length > 0)
    {
      starsByManufactoryPresence.withManufactories.sort(sortByManufactoryCapacityFN);
      initialSelected = starsByManufactoryPresence.withManufactories[0];
    }
    else if (starsByManufactoryPresence.withoutManufactories.length > 0)
    {
      starsByManufactoryPresence.withoutManufactories.sort(sortByManufactoryCapacityFN);
      initialSelected = starsByManufactoryPresence.withoutManufactories[0];
    }

    return(
    {
      selectedStar: initialSelected, // Star
      highlightedStars: [initialSelected], // Star[]
      money: player.money
    });
  }

  triggerUpdate()
  {
    this.forceUpdate();
  }

  componentDidMount()
  {
    eventManager.addEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
  }

  getStarsWithAndWithoutManufactories()
  {
    var player = this.props.player;

    var starsWithManufactories: Star[] = [];
    var starsWithoutManufactories: Star[] = [];

    for (var i = 0; i < player.controlledLocations.length; i++)
    {
      var star = player.controlledLocations[i];
      if (star.manufactory)
      {
        starsWithManufactories.push(star);
      }
      else
      {
        starsWithoutManufactories.push(star);
      }
    }

    return(
    {
      withManufactories: starsWithManufactories,
      withoutManufactories: starsWithoutManufactories
    });
  }
  
  handleStarSelect(star: Star)
  {
    if (this.state.selectedStar === star)
    {
      this.clearSelection();
    }
    else
    {
      this.setState(
      {
        selectedStar: star,
        highlightedStars: [star]
      });
    }
  }

  clearSelection()
  {
    this.setState(
    {
      selectedStar: undefined,
      highlightedStars: []
    });
  }

  render()
  {
    var player = this.props.player;
    var selectedStar: Star = this.state.selectedStar;

    var starsByManufactoryPresence = this.getStarsWithAndWithoutManufactories();

    var queueElement: React.ReactElement<any> = null;
    if (selectedStar)
    {
      if (selectedStar.manufactory)
      {
        queueElement = BuildQueue(
        {
          manufactory: selectedStar.manufactory,
          triggerUpdate: this.triggerUpdate,
          money: this.state.money
        });
      }
      else
      {
        queueElement = ConstructManufactory(
        {
          star: selectedStar,
          player: player,
          money: this.state.money,
          triggerUpdate: this.triggerUpdate
        });
      }
    }

    return(
      React.DOM.div(
      {
        className: "production-overview"
      },
        ManufactoryStarsList(
        {
          starsWithManufactories: starsByManufactoryPresence.withManufactories,
          starsWithoutManufactories: starsByManufactoryPresence.withoutManufactories,
          highlightedStars: this.state.highlightedStars,
          handleStarSelect: this.handleStarSelect
        }),
        React.DOM.div(
        {
          className: "production-overview-contents"
        },
          queueElement,
          ManufacturableThings(
          {
            selectedStar: selectedStar,
            player: player,
            money: this.state.money,
            triggerUpdate: this.triggerUpdate
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ProductionOverviewComponent);
export default Factory;
