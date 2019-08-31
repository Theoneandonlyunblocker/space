import * as React from "react";
import * as ReactDOM from "react-dom";

import {Battle} from "../battle/Battle";
import {BattlePrep} from "../battleprep/BattlePrep";
import {Game} from "../game/Game";
import {MapRenderer} from "../maprenderer/MapRenderer";
import {GameModuleInitializationPhase} from "../modules/GameModuleInitializationPhase";
import {ModuleInitializer} from "../modules/ModuleInitializer";
import {Player} from "../player/Player";
import {PlayerControl} from "../interaction/PlayerControl";
import {ReactUIScene} from "./UIScenes";
import {Renderer} from "../graphics/Renderer";
import {activePlayer} from "../app/activePlayer";
import {eventManager} from "../app/eventManager";
import {options} from "../app/Options";

import {activeModuleData} from "../app/activeModuleData";


const moduleInitializationPhaseByScene:
{
  [key in ReactUIScene]: GameModuleInitializationPhase;
} =
{
  battle: GameModuleInitializationPhase.BattleStart,
  battlePrep: GameModuleInitializationPhase.BattlePrep,
  galaxyMap: GameModuleInitializationPhase.GameStart,
  setupGame: GameModuleInitializationPhase.GameSetup,
  errorRecovery: GameModuleInitializationPhase.AppInit,

  flagMaker: GameModuleInitializationPhase.GameSetup,
  battleSceneTester: GameModuleInitializationPhase.BattleStart,
  vfxEditor: GameModuleInitializationPhase.BattleStart,
};

export class ReactUI
{
  public currentScene: ReactUIScene;
  public battle: Battle;
  public battlePrep: BattlePrep;
  public renderer: Renderer;
  public mapRenderer: MapRenderer;
  public playerControl: PlayerControl;
  public player: Player;
  public game: Game;

  private container: HTMLElement;
  private moduleInitializer: ModuleInitializer;
  private errorMessage: string | undefined;

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
      activeModuleData.uiScenes.topLevelErrorBoundary(
      {
        errorReportingMode: options.system.errorReporting,
        errorMessage: this.errorMessage,
      },
        elementToRender,
      ),
      this.container,
    );
  }
  public triggerError(message: string): void
  {
    this.errorMessage = message;
    this.switchScene("errorRecovery");
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
          activeLanguage: options.display.language,
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
          errorMessage: this.errorMessage,
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
      case "vfxEditor":
      {
        return activeModuleData.uiScenes.vfxEditor();
      }
    }
  }
}
