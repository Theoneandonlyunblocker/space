/// <reference path="../lib/pixi.d.ts" />

import BackgroundDrawer from "./BackgroundDrawer";
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import Camera from "./Camera";
import MouseEventHandler from "./MouseEventHandler";
import PathfindingArrow from "./PathfindingArrow";
import Point from "./Point";


export default class Renderer
{
  public renderer: PIXI.WebGLRenderer;
  public layers:
  {
    background: PIXI.Container;

    main: PIXI.Container;
    map: PIXI.Container;
    select: PIXI.Container;
  };
  public camera: Camera;
  public toCenterOn: Point;


  private stage: PIXI.Container;
  private pixiContainer: HTMLElement;
  private mouseEventHandler: MouseEventHandler;
  private pathfindingArrow: PathfindingArrow;

  private backgroundDrawer: BackgroundDrawer;
  private activeRenderLoopId: number = 0;
  private isPaused: boolean = false;
  private forceFrame: boolean = false;

  private resizeListener: (e: Event) => void;

  constructor(backgroundSeed: string, backgroundDrawingFunction: BackgroundDrawingFunction)
  {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.stage = new PIXI.Container();
    this.backgroundDrawer = new BackgroundDrawer(
    {
      seed: backgroundSeed,
      drawBackgroundFN: backgroundDrawingFunction,
    });

    this.setupDefaultLayers();

    this.activeRenderLoopId++;

    this.stage.renderable = true;

    this.resizeListener = this.resize.bind(this);
    window.addEventListener("resize", this.resizeListener, false);
  }

  public destroy()
  {
    this.stage.renderable = false;
    this.pause();

    this.backgroundDrawer.destroy();

    if (this.pathfindingArrow)
    {
      this.pathfindingArrow.destroy();
      this.pathfindingArrow = null;
    }

    if (this.mouseEventHandler)
    {
      this.mouseEventHandler.destroy();
      this.mouseEventHandler = null;
    }

    if (this.camera)
    {
      this.camera.destroy();
      this.camera = null;
    }

    if (this.renderer)
    {
      this.renderer.destroy(true);
      this.renderer = null;
    }

    this.stage.destroy(true);
    this.stage = null;
    this.pixiContainer = null;

    window.removeEventListener("resize", this.resizeListener);
  }
  public removeRendererView()
  {
    if (this.renderer && this.renderer.view.parentNode)
    {
      this.renderer.view.parentNode.removeChild(this.renderer.view);
    }
  }
  public bindRendererView(container: HTMLElement)
  {
    this.pixiContainer = container;

    if (!this.renderer)
    {
      const containerStyle = window.getComputedStyle(this.pixiContainer);
      this.renderer = new PIXI.WebGLRenderer(
        parseInt(containerStyle.width),
        parseInt(containerStyle.height),
        {
          autoResize: false,
          antialias: true,
        },
      );

      this.backgroundDrawer.setExternalRenderer(this.renderer);
    }

    this.pixiContainer.appendChild(this.renderer.view);
    this.renderer.view.setAttribute("id", "pixi-canvas");

    this.backgroundDrawer.bindRendererView(this.pixiContainer);

    this.resize();

    // this.renderOnce();
    this.addCamera();
  }
  public pause()
  {
    this.isPaused = true;
    this.forceFrame = false;
  }
  public resume()
  {
    this.isPaused = false;
    this.forceFrame = false;
    this.activeRenderLoopId = this.activeRenderLoopId++;
    this.render(this.activeRenderLoopId);
  }

  private setupDefaultLayers()
  {
    this.layers =
    {
      background: this.backgroundDrawer.pixiContainer,

      main: new PIXI.Container(),
      map: new PIXI.Container(),
      select: new PIXI.Container(),
    };

    this.layers.select.interactiveChildren = false;

    this.layers.main.addChild(this.layers.map);
    this.layers.main.addChild(this.layers.select);


    this.stage.removeChildren();
    this.stage.addChild(this.layers.background);
    this.stage.addChild(this.layers.main);
  }
  private addCamera()
  {
    let oldToCenterOn: Point;

    if (this.mouseEventHandler)
    {
      this.mouseEventHandler.destroy();
    }
    if (this.camera)
    {
      oldToCenterOn = this.camera.toCenterOn;
      this.camera.destroy();
    }
    this.camera = new Camera(this.layers.main, 0.5);
    this.camera.toCenterOn = this.toCenterOn || oldToCenterOn;
    this.toCenterOn = null;

    this.mouseEventHandler = new MouseEventHandler(this, this.camera);
    this.addEventListeners();

    this.pathfindingArrow = new PathfindingArrow(this.layers.select);
  }
  private addEventListeners()
  {
    this.renderer.plugins.interaction.on("pointerdown", this.mouseEventHandler.mouseDown);
    this.renderer.plugins.interaction.on("pointerup", this.mouseEventHandler.mouseUp);
    this.renderer.plugins.interaction.on("pointerupoutside", this.mouseEventHandler.mouseUp);
    this.renderer.plugins.interaction.on("pointermove", this.mouseEventHandler.mouseMove);
  }
  private resize()
  {
    if (this.renderer && document.body.contains(this.renderer.view))
    {
      const w = this.pixiContainer.offsetWidth * window.devicePixelRatio;
      const h = this.pixiContainer.offsetHeight * window.devicePixelRatio;
      this.renderer.resize(w, h);

      this.backgroundDrawer.handleResize();

      if (this.isPaused)
      {
        this.renderOnce();
      }
    }
  }
  private renderOnce()
  {
    this.forceFrame = true;
    this.render();
  }
  private render(renderLoopId?: number)
  {
    if (!document.body.contains(this.pixiContainer))
    {
      this.pause();

      return;
    }
    if (this.isPaused)
    {
      if (this.forceFrame)
      {
        this.forceFrame = false;
      }
      else
      {
        return;
      }
    }

    this.renderer.render(this.stage);

    if (this.activeRenderLoopId === renderLoopId)
    {
      window.requestAnimationFrame(this.render.bind(this, renderLoopId));
    }
  }
}
