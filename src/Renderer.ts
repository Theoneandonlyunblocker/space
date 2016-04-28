/// <reference path="../lib/pixi.d.ts" />

import Camera from "./Camera";
import MouseEventHandler from "./MouseEventHandler";
import PathfindingArrow from "./PathfindingArrow";
import Point from "./Point";
import BackgroundDrawer from "./BackgroundDrawer";
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";

export default class Renderer
{
  stage: PIXI.Container;
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  pixiContainer: HTMLElement;
  layers:
  {
    background: PIXI.Container;
    
    main: PIXI.Container;
    map: PIXI.Container;
    select: PIXI.Container;
  };
  camera: Camera;
  mouseEventHandler: MouseEventHandler;
  pathfindingArrow: PathfindingArrow;
  
  private backgroundDrawer: BackgroundDrawer;
  private activeRenderLoopId: number = 0;
  isPaused: boolean = false;
  forceFrame: boolean = false;

  toCenterOn: Point;
  resizeListener: (e: Event) => void;

  constructor(backgroundSeed: string, backgroundDrawingFunction: BackgroundDrawingFunction)
  {
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    
    this.stage = new PIXI.Container();
    this.backgroundDrawer = new BackgroundDrawer(
    {
      seed: backgroundSeed,
      drawBackgroundFN: backgroundDrawingFunction
    });
  }
  init()
  {
    this.setupDefaultLayers();

    this.addEventListeners();
    this.activeRenderLoopId++;

    this.stage.renderable = true;
    
    this.resizeListener = this.resize.bind(this);
    window.addEventListener("resize", this.resizeListener, false);
  }
  destroy()
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
  removeRendererView()
  {
    if (this.renderer && this.renderer.view.parentNode)
    {
      this.renderer.view.parentNode.removeChild(this.renderer.view);
    }
  }
  bindRendererView(container: HTMLElement)
  {
    this.pixiContainer = container;

    if (!this.renderer)
    {
      var containerStyle = window.getComputedStyle(this.pixiContainer);
      this.renderer = PIXI.autoDetectRenderer(
        parseInt(containerStyle.width),
        parseInt(containerStyle.height),
        {
          autoResize: false,
          antialias: true
        }
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
  setupDefaultLayers()
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
  addCamera()
  {
    var oldToCenterOn: Point;

    if (this.mouseEventHandler) this.mouseEventHandler.destroy();
    if (this.camera)
    {
      oldToCenterOn = this.camera.toCenterOn;
      this.camera.destroy();
    }
    this.camera = new Camera(this.layers.main, 0.5);
    this.camera.toCenterOn = this.toCenterOn || oldToCenterOn;
    this.toCenterOn = null;

    this.mouseEventHandler = new MouseEventHandler(this, this.camera);

    this.pathfindingArrow = new PathfindingArrow(this.layers.select);
  }
  addEventListeners()
  {
    var self = this;

    var main = this.stage;
    main.interactive = true;

    main.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);

    var mainMouseDownFN = function(event: PIXI.interaction.InteractionEvent)
    {
      if (event.target !== main) return;
      self.mouseEventHandler.mouseDown(event);
    };
    var mainMouseMoveFN = function(event: PIXI.interaction.InteractionEvent)
    {
      if (event.target !== main) return;
      self.mouseEventHandler.mouseMove(event);
    }
    var mainMouseUpFN = function(event: PIXI.interaction.InteractionEvent)
    {
      if (event.target !== main) return;
      self.mouseEventHandler.mouseUp(event);
    }
    var mainMouseUpOutsideFN = function(event: PIXI.interaction.InteractionEvent)
    {
      if (event.target !== main) return;
      self.mouseEventHandler.mouseUp(event);
    }

    var mainListeners =
    {
      mousedown: mainMouseDownFN,
      rightdown: mainMouseDownFN,
      touchstart: mainMouseDownFN,
      mousemove: mainMouseMoveFN,
      touchmove: mainMouseMoveFN,
      mouseup: mainMouseUpFN,
      rightup: mainMouseUpFN,
      touchend: mainMouseUpFN,
      mouseupoutside: mainMouseUpOutsideFN,
      rightupoutside: mainMouseUpOutsideFN,
      touchendoutside: mainMouseUpOutsideFN,
    };

    for (let eventType in mainListeners)
    {
      main.on(eventType, mainListeners[eventType]);
    }
  }
  resize()
  {
    if (this.renderer && document.body.contains(this.renderer.view))
    {
      var w = this.pixiContainer.offsetWidth * window.devicePixelRatio;
      var h = this.pixiContainer.offsetHeight * window.devicePixelRatio;
      this.renderer.resize(w, h);
      
      this.backgroundDrawer.handleResize();

      if (this.isPaused)
      {
        this.renderOnce();
      }
    }
  }
  renderOnce()
  {
    this.forceFrame = true;
    this.render();
  }
  pause()
  {
    this.isPaused = true;
    this.forceFrame = false;
  }
  resume()
  {
    this.isPaused = false;
    this.forceFrame = false;
    this.activeRenderLoopId = this.activeRenderLoopId++;
    this.render(this.activeRenderLoopId);
  }
  render(renderLoopId?: number)
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
      window.requestAnimationFrame( this.render.bind(this, renderLoopId) );
    }
  }
}
