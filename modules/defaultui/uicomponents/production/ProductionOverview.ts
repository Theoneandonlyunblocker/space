import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Player from "../../Player";
import Star from "../../Star";
import eventManager from "../../eventManager";
import UpdateWhenMoneyChanges from "../mixins/UpdateWhenMoneyChanges";
import applyMixins from "../mixins/applyMixins";

import BuildQueue from "./BuildQueue";
import ConstructManufactory from "./ConstructManufactory";
import ManufactoryStarsList from "./ManufactoryStarsList";
import ManufacturableThings from "./ManufacturableThings";


export interface PropTypes extends React.Props<any>
{
  player: Player;
  globalSelectedStar: Star | null;
  setSelectedStar: (star: Star | null) => void;
}

interface StateType
{
  selectedStar: Star | null;
  money: number;
}

export class ProductionOverviewComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ProductionOverview";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = {
      selectedStar: this.getInitialSelectedStar(),
      money: this.props.player.money,
    };

    this.getStarsWithAndWithoutManufactories = this.getStarsWithAndWithoutManufactories.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);

    applyMixins(this, new UpdateWhenMoneyChanges(this));
  }

  public static getDerivedStateFromProps(props: PropTypes): Partial<StateType>
  {
    if (props.globalSelectedStar && props.player.canAccessManufactoringAtLocation(props.globalSelectedStar))
    {
      return({
        selectedStar: props.globalSelectedStar,
      });
    }
    else
    {
      return null;
    }
  }

  public componentDidMount()
  {
    eventManager.addEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
  }
  public componentWillUnmount()
  {
    eventManager.removeEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
  }
  public render()
  {
    const player = this.props.player;
    const selectedStar = this.state.selectedStar;

    const starsByManufactoryPresence = this.getStarsWithAndWithoutManufactories();

    let queueElement: React.ReactElement<any> = null;
    if (selectedStar && this.props.player.canAccessManufactoringAtLocation(selectedStar))
    {
      if (selectedStar.manufactory)
      {
        queueElement = BuildQueue(
        {
          manufactory: selectedStar.manufactory,
          triggerUpdate: this.triggerUpdate,
          money: this.state.money,
        });
      }
      else
      {
        queueElement = ConstructManufactory(
        {
          star: selectedStar,
          player: player,
          money: this.state.money,
          triggerUpdate: this.triggerUpdate,
        });
      }
    }

    return(
      ReactDOMElements.div(
      {
        className: "production-overview",
      },
        ManufactoryStarsList(
        {
          starsWithManufactories: starsByManufactoryPresence.withManufactories,
          starsWithoutManufactories: starsByManufactoryPresence.withoutManufactories,
          highlightedStars: [selectedStar],
          setSelectedStar: this.props.setSelectedStar,
        }),
        ReactDOMElements.div(
        {
          className: "production-overview-contents",
        },
          queueElement,
          selectedStar && this.props.player.canAccessManufactoringAtLocation ? ManufacturableThings(
          {
            selectedStar: selectedStar,
            player: player,
            money: this.state.money,
            triggerUpdate: this.triggerUpdate,
          }) : null,
        ),
      )
    );
  }

  private getInitialSelectedStar(): Star | null
  {
    if (this.props.globalSelectedStar && this.props.player.canAccessManufactoringAtLocation(this.props.globalSelectedStar))
    {
      return this.props.globalSelectedStar;
    }
    else if (this.props.player.controlledLocations.length === 1)
    {
      return this.props.player.controlledLocations[0];
    }
    else
    {
      return null;
    }
  }
  private triggerUpdate()
  {
    this.forceUpdate();
  }
  private getStarsWithAndWithoutManufactories()
  {
    const player = this.props.player;

    const starsWithManufactories: Star[] = [];
    const starsWithoutManufactories: Star[] = [];

    for (let i = 0; i < player.controlledLocations.length; i++)
    {
      const star = player.controlledLocations[i];
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
      withoutManufactories: starsWithoutManufactories,
    });
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ProductionOverviewComponent);
export default factory;
