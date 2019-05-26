import * as React from "react";
import * as ReactDOM from "react-dom";

import Battle from "./Battle";
import BattlePrep from "./BattlePrep";
import Game from "./Game";
import MapRenderer from "./MapRenderer";
import ModuleFileInitializationPhase from "./ModuleFileInitializationPhase";
import ModuleInitializer from "./ModuleInitializer";
import Player from "./Player";
import PlayerControl from "./PlayerControl";
import {ReactUIScene} from "./UIScenes";
import Renderer from "./Renderer";
import {activePlayer} from "./activePlayer";
import eventManager from "./eventManager";
import Options from "./Options";

// TODO 2019.05.26 | remove vvv
import {ErrorBoundary} from "./uicomponents/errors/ErrorBoundary";
import {SaveRecoveryWithDetails} from "./uicomponents/errors/SaveRecoveryWithDetails";

import {localize} from "../localization/localize";
// TODO 2019.05.26 | remove ^^^

import {activeModuleData} from "./activeModuleData";


const moduleInitializationPhaseByScene:
{
  [key in ReactUIScene]: ModuleFileInitializationPhase;
} =
{
  battle: ModuleFileInitializationPhase.BattleStart,
  battlePrep: ModuleFileInitializationPhase.BattlePrep,
  galaxyMap: ModuleFileInitializationPhase.GameStart,
  setupGame: ModuleFileInitializationPhase.GameSetup,
  errorRecovery: ModuleFileInitializationPhase.AppInit,

  flagMaker: ModuleFileInitializationPhase.GameSetup,
  battleSceneTester: ModuleFileInitializationPhase.BattleStart,
  sfxEditor: ModuleFileInitializationPhase.BattleStart,
};

export default class ReactUI
{
  public currentScene: ReactUIScene;
  public battle: Battle;
  public battlePrep: BattlePrep;
  public renderer: Renderer;
  public mapRenderer: MapRenderer;
  public playerControl: PlayerControl;
  public player: Player;
  public game: Game;

  public error: Error | undefined;

  private container: HTMLElement;
  private moduleInitializer: ModuleInitializer;

  constructor(container: HTMLElement, moduleInitializer: ModuleInitializer)
  {
    this.container = container;
    this.moduleInitializer = moduleInitializer;

    this.addEventListeners();
  }

  public switchScene(newScene: ReactUIScene): Promise<void>
  {
    this.currentScene = newScene;

    return this.initializeModulesNeededForCurrentScene().then(() =>
    {
      this.render();
    });
  }
  public destroy()
  {
    eventManager.removeAllListeners("switchScene");
    eventManager.removeAllListeners("renderUI");
    ReactDOM.unmountComponentAtNode(this.container);
    this.container = null;
  }
  public render()
  {
    const elementToRender = this.getElementToRender();

    ReactDOM.render(
      React.createElement(React.StrictMode, null,
        // TODO 2019.05.26 | offload this to modules
        ErrorBoundary(
        {
          renderError: (error, info) =>
          {
            // TODO 2018.10.30 | doesn't respect user error handling preference.
            // react doesn't let us ignore errors in rendering I think

            const customErrorMessage = Options.system.errorReporting !== "panic" ?
              localize("UIErrorPanicDespiteUserPreference")(Options.system.errorReporting) :
              null;

            return SaveRecoveryWithDetails(
            {
              game: this.game,
              error: error,
              customMessage: customErrorMessage,
            });
          },
        },
          elementToRender,
        ),
      ),
      this.container,
    );
  }

  private addEventListeners()
  {
    eventManager.addEventListener("switchScene", this.switchScene.bind(this));
    eventManager.addEventListener("renderUI", this.render.bind(this));
  }
  private initializeModulesNeededForCurrentScene(): Promise<void>
  {
    const phase = moduleInitializationPhaseByScene[this.currentScene];

    return this.moduleInitializer.initModulesNeededForPhase(phase);
  }
  private getElementToRender(): React.ReactElement<any>
  {
    switch (this.currentScene)
    {
      case "battle":
      {
        return activeModuleData.uiScenes.battle(
        {
          battle: this.battle,
          humanPlayer: this.player,
        });
      }
      case "battlePrep":
      {
        return activeModuleData.uiScenes.battlePrep(
        {
          battlePrep: this.battlePrep,
        });
      }
      case "galaxyMap":
      {
        return activeModuleData.uiScenes.galaxyMap(
        {
          renderer: this.renderer,
          mapRenderer: this.mapRenderer,
          playerControl: this.playerControl,
          player: this.player,
          game: this.game,
          activeLanguage: Options.display.language,
          notifications: [...activePlayer.notificationLog.unreadNotifications],
          notificationLog: activePlayer.notificationLog,
        });
      }
      case "setupGame":
      {
        return activeModuleData.uiScenes.setupGame();
      }
      case "errorRecovery":
      {
        return activeModuleData.uiScenes.errorRecovery(
        {
          game: this.game,
          error: this.error,
        });
      }

      // debug scenes
      case "flagMaker":
      {
        return activeModuleData.uiScenes.flagMaker();
      }
      case "battleSceneTester":
      {
        return activeModuleData.uiScenes.battleSceneTester();
      }
      case "sfxEditor":
      {
        return activeModuleData.uiScenes.sfxEditor();
      }
    }
  }
}
