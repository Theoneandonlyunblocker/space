/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";


import Technology from "./Technology";
import PlayerTechnology from "../../PlayerTechnology";
import eventManager from "../../eventManager";


interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
}

interface StateType
{
}

export class TechnologiesListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TechnologiesList";
  updateListener: Function = undefined;


  state: StateType;

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
    var playerTechnology = this.props.playerTechnology;
    
    var researchSpeed = playerTechnology.getResearchSpeed();
    var rows: React.ReactElement<any>[] = [];

    for (var key in playerTechnology.technologies)
    {
      rows.push(Technology(
      {
        playerTechnology: playerTechnology,
        technology: playerTechnology.technologies[key].technology,
        researchPoints: researchSpeed,
        key: key
      }));
    }

    return(
      React.DOM.div(
      {
        className: "technologies-list-container"
      },
        React.DOM.div(
        {
          className: "technologies-list"
        },
          rows
        ),
        React.DOM.div(
        {
          className: "technologies-list-research-speed"
        },
          "Research speed: " + researchSpeed + " per turn"
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TechnologiesListComponent);
export default Factory;
