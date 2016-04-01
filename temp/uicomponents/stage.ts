/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../lib/react-global-0.13.3.d.ts" />

/// <reference path="battle/battle.ts"/>
/// <reference path="unitlist/unitlist.ts"/>
/// <reference path="unitlist/itemequip.ts"/>
/// <reference path="battleprep/battleprep.ts"/>
/// <reference path="galaxymap/galaxymap.ts"/>
/// <reference path="setupgame/setupgame.ts"/>

/// <reference path="flagmaker.ts"/>
/// <reference path="battlescenetester.ts" />

export interface ReactComponentPlaceHolder
{

}
export interface ReactDOMPlaceHolder
{
  
}
export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class Stage extends React.Component<PropTypes, {}>
{
  displayName: string = "Stage";
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  changeScene()
  {
    var newScene = this.refs.sceneSelector.getDOMNode().value;

    this.props.changeSceneFunction(newScene);
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var elementsToRender: ReactComponentPlaceHolder[] = [];

    switch (this.props.sceneToRender)
    {
      case "battle":
      {
        elementsToRender.push(
          UIComponents.Battle(
          {
            battle: this.props.battle,
            humanPlayer: this.props.player,
            renderer: this.props.renderer,
            key: "battle"
          })
        );
        break;
      }
      case "battlePrep":
      {
        elementsToRender.push(
          UIComponents.BattlePrep(
          {
            battlePrep: this.props.battlePrep,
            renderer: this.props.renderer,
            key: "battlePrep"
          })
        );
        break;
      }
      case "galaxyMap":
      {
        elementsToRender.push(
          UIComponents.GalaxyMap(
          {
            renderer: this.props.renderer,
            mapRenderer: this.props.mapRenderer,
            playerControl: this.props.playerControl,
            player: this.props.player,
            game: this.props.game,
            key: "galaxyMap"
          })
        );
        break;
      }
      case "flagMaker":
      {
        elementsToRender.push(
          UIComponents.FlagMaker(
          {
            key: "flagMaker"
          })
        );
        break;
      }
      case "setupGame":
      {
        elementsToRender.push(
          UIComponents.SetupGame(
          {
            key: "setupGame"
          })
        );
        break;
      }
      case "battleSceneTester":
      {
        elementsToRender.push(
          UIComponents.BattleSceneTester(
          {
            key: "battleSceneTester"
          })
        );
        break;
      }
    }
    return(
      React.DOM.div({className: "react-stage"},
        elementsToRender
      )
    );
  }
}
