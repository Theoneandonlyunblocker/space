import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {PlayerTechnology} from "src/player/PlayerTechnology";
import {eventManager} from "src/app/eventManager";

import {Technology} from "./Technology";


export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
}

interface StateType
{
}

export class TechnologiesListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TechnologiesList";
  private updateListener: () => void;


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  componentDidMount()
  {
    this.updateListener = eventManager.addEventListener(
      "builtBuildingWithEffect_research", this.forceUpdate.bind(this));
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("builtBuildingWithEffect_research", this.updateListener);
  }
  render()
  {
    const playerTechnology = this.props.playerTechnology;

    const researchSpeed = playerTechnology.getResearchSpeed();
    const rows: React.ReactElement<any>[] = [];

    for (const key in playerTechnology.technologies)
    {
      rows.push(Technology(
      {
        playerTechnology: playerTechnology,
        technology: playerTechnology.technologies[key].technology,
        researchPoints: researchSpeed,
        key: key,
      }));
    }

    return(
      ReactDOMElements.div(
      {
        className: "technologies-list-container",
      },
        ReactDOMElements.div(
        {
          className: "technologies-list",
        },
          rows,
        ),
        ReactDOMElements.div(
        {
          className: "technologies-list-research-speed",
        },
          `${localize("researchSpeed")}: ${researchSpeed} ${localize("perTurn")}`,
        ),
      )
    );
  }
}

export const TechnologiesList: React.Factory<PropTypes> = React.createFactory(TechnologiesListComponent);
