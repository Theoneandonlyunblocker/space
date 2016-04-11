/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../playertechnology.ts" />

/// <reference path="technology.ts" />


import Technology from "./Technology.ts";
import PlayerTechnology from "../../../src/PlayerTechnology.ts";
import eventManager from "../../../src/eventManager.ts";


export interface PropTypes extends React.Props<any>
{
  playerTechnology: PlayerTechnology;
}

interface StateType
{
  // TODO refactor | add state type
}

class TechnologiesList_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "TechnologiesList";
  updateListener: reactTypeTODO_any = undefined;


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
    var playerTechnology: PlayerTechnology = this.props.playerTechnology;
    
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

const Factory: React.Factory<PropTypes> = React.createFactory(TechnologiesList_COMPONENT_TODO);
export default Factory;
