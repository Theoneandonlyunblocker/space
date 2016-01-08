/// <reference path="../lib/pixi.d.ts" />

/// <reference path="camera.ts"/>
/// <reference path="mouseeventhandler.ts"/>
/// <reference path="shadermanager.ts"/>
/// <reference path="pathfindingarrow.ts"/>

module Rance
{
  export class Renderer
  {
    stage: PIXI.Container;
    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    pixiContainer: HTMLElement;
    layers:
    {
      [name: string] : PIXI.Container;
    } = {};
    camera: Camera;
    mouseEventHandler: MouseEventHandler;
    shaderManager: ShaderManager;
    pathfindingArrow: PathfindingArrow;
    
    private activeRenderLoopId: number = 0;
    isPaused: boolean = false;
    forceFrame: boolean = false;
    backgroundIsDirty: boolean = true;
    isBattleBackground: boolean = false;
    blurProps: number[];

    toCenterOn: Point;
    resizeListener: (e: Event) => void;

    galaxyMap: GalaxyMap; // used for bg drawing fn seed TODO move?

    constructor(galaxyMap: GalaxyMap)
    {
      PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
      
      this.stage = new PIXI.Container();
      this.galaxyMap = galaxyMap;

      this.resizeListener = this.resize.bind(this);
      window.addEventListener("resize", this.resizeListener, false);
    }
    init()
    {
      this.shaderManager = new ShaderManager();
      this.initLayers();

      this.addEventListeners();
      this.activeRenderLoopId++;

      this.stage.renderable = true;
    }
    destroy()
    {
      this.stage.renderable = false;
      this.pause();

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

      this.shaderManager = null;
      this.galaxyMap = null;

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
      }
      
      this.pixiContainer.appendChild(this.renderer.view);
      this.renderer.view.setAttribute("id", "pixi-canvas");

      this.resize();
      
      if (!this.isBattleBackground)
      {
        this.setupDefaultLayers();
        this.addCamera();
      }
      else
      {
        this.setupBackgroundLayers();
      }
    }
    initLayers()
    {
      var _bgSprite = this.layers["bgSprite"] = new PIXI.Container();
      _bgSprite.interactiveChildren = false;

      var _main = this.layers["main"] = new PIXI.Container();

      var _map = this.layers["map"] = new PIXI.Container();

      var _bgFilter = this.layers["bgFilter"] = new PIXI.Container();
      _bgFilter.interactiveChildren = false;

      var _select = this.layers["select"] = new PIXI.Container();
      _select.interactiveChildren = false;

      _main.addChild(_map);
      _main.addChild(_select);
    }
    setupDefaultLayers()
    {
      this.stage.removeChildren();
      this.stage.addChild(this.layers["bgSprite"]);
      this.stage.addChild(this.layers["main"]);
      this.renderOnce();
    }
    setupBackgroundLayers()
    {
      this.stage.removeChildren();
      this.stage.addChild(this.layers["bgSprite"]);
      this.renderOnce();
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
      this.camera = new Camera(this.layers["main"], 0.5);
      this.camera.toCenterOn = this.toCenterOn || oldToCenterOn;

      this.mouseEventHandler = new MouseEventHandler(this, this.camera);

      this.pathfindingArrow = new PathfindingArrow(this.layers["select"]);
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

      for (var eventType in mainListeners)
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
        this.layers["bgFilter"].filterArea = new PIXI.Rectangle(0, 0, w, h);
        this.backgroundIsDirty = true;
        if (this.isPaused)
        {
          this.renderOnce();
        }
      }
    }
    renderBackground()
    {
      var bgObject: PIXI.DisplayObject;
      if (this.isBattleBackground)
      {
        bgObject = this.renderBlurredBackground.apply(this, this.blurProps);
      }
      else
      {
        bgObject = app.moduleData.mapBackgroundDrawingFunction(this.galaxyMap.seed, this.renderer);
      }

      this.layers["bgSprite"].removeChildren();
      this.layers["bgSprite"].addChild(bgObject);

      this.backgroundIsDirty = false;
    }
    renderBlurredBackground(x: number, y: number, width: number, height: number, seed: string)
    {
      var bg = app.moduleData.starBackgroundDrawingFunction(seed, this.renderer);
      var fg = app.moduleData.starBackgroundDrawingFunction(seed, this.renderer);

      var container = new PIXI.Container();
      container.addChild(bg);
      container.addChild(fg);

      var blurFilter = new PIXI.filters.BlurFilter();
      blurFilter.blur = 1;
      fg.filters = [blurFilter];
      fg.filterArea = new PIXI.Rectangle(x, y, width, height);

      var texture = container.generateTexture(this.renderer);//, PIXI.SCALE_MODES.DEFAULT, 1, bg.getLocalBounds());
      var sprite = new PIXI.Sprite(texture);

      return sprite;
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
      if (this.backgroundIsDirty)
      {
        this.renderBackground();
      }

      this.shaderManager.uniformManager.updateTime();

      this.renderer.render(this.stage);

      if (this.activeRenderLoopId === renderLoopId)
      {
        window.requestAnimationFrame( this.render.bind(this, renderLoopId) );
      }
    }
  }
}
