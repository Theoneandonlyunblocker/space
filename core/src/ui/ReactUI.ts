import * as React from "react";
import * as ReactDOM from "react-dom";

import {Battle} from "../battle/Battle";
import {BattlePrep} from "../battleprep/BattlePrep";
import {Game} from "../game/Game";
import {MapRenderer} from "../maprenderer/MapRenderer";
import {ModuleAssetLoader} from "../modules/ModuleAssetLoader";
import {Player} from "../player/Player";
import {PlayerControl} from "../interaction/PlayerControl";
import {Renderer} from "../graphics/Renderer";
import {eventManager} from "../app/eventManager";

import {activeModuleData} from "../app/activeModuleData";
import { UIScene } from "./UIScene";
import { CoreUIScenes, NonCoreUIScenes } from "./CoreUIScenes";


export class ReactUI
{
  public currentScene: UIScene;
  public battle: Battle;
  public battlePrep: BattlePrep;
  public renderer: Renderer;
  public mapRenderer: MapRenderer;
  public playerControl: PlayerControl;
  public player: Player;
  public game: Game;
  public errorMessage: string | undefined;

  private container: HTMLElement;
  private moduleInitializer: ModuleAssetLoader;

  constructor(container: HTMLElement, moduleInitializer: ModuleAssetLoader)
  {
    this.container = container;
    this.moduleInitializer = moduleInitializer;

    this.addEventListeners();
  }

  public switchScene<CustomScenes extends NonCoreUIScenes = {}>(newScene: keyof (CoreUIScenes & CustomScenes)): Promise<void>
  {
    this.currentScene = (activeModuleData.uiScenes as CoreUIScenes & CustomScenes)[newScene];

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
      activeModuleData.uiScenes.topLevelErrorBoundary.render(
        this,
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
    eventManager.addEventListener("switchScene", (newScene: keyof CoreUIScenes) => this.switchScene(newScene));
    eventManager.addEventListener("renderUI", this.render.bind(this));
  }
  private initializeModulesNeededForCurrentScene(): Promise<void>
  {
    const phase = this.currentScene.requiredInitializationPhase;

    return this.moduleInitializer.loadAssetsNeededForPhase(phase);
  }
  private getElementToRender(): React.ReactElement<any>
  {
    return this.currentScene.render(this);
  }
}
