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
    pixiContainer: HTMLCanvasElement;
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

    constructor()
    {
      PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
      
      this.stage = new PIXI.Container();

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
    bindRendererView(container: HTMLCanvasElement)
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
        var w = this.pixiContainer.offsetWidth;
        var h = this.pixiContainer.offsetHeight;
        this.renderer.resize(w, h);
        this.layers["bgFilter"].filterArea = new PIXI.Rectangle(0, 0, w, h);
        this.backgroundIsDirty = true;
        if (this.isPaused)
        {
          this.renderOnce();
        }
      }
    }
    makeBackgroundTexture(seed?: any)
    {
      function copyUniforms(uniformObj: any, target?: any)
      {
        if (!target) target = {};
        for (var name in uniformObj)
        {
          if (!target[name])
          {
            target[name] = {type: uniformObj[name].type}; 
          }

          target[name].value = uniformObj[name].value;
        }

        return target;
      }

      var nebulaFilter = this.shaderManager.shaders["nebula"];

      var oldRng = Math.random;
      var oldUniforms = copyUniforms(nebulaFilter.uniforms);
      Math.random = RNG.prototype.uniform.bind(new RNG(seed));


      var nebulaColorScheme = generateColorScheme();

      var lightness = randRange(1, 1.2);

      var newUniforms =
      {
        baseColor: {value: hex2rgb(nebulaColorScheme.main)},
        overlayColor: {value: hex2rgb(nebulaColorScheme.secondary)},
        highlightColor: {value: [1.0, 1.0, 1.0]},

        coverage: {value: randRange(0.2, 0.4)},

        scale: {value: randRange(4, 8)},

        diffusion: {value: randRange(1.5, 3.0)},
        streakiness: {value: randRange(1.5, 2.5)},

        streakLightness: {value: lightness},
        cloudLightness: {value: lightness},

        highlightA: {value: 0.9},
        highlightB: {value: 2.2},

        seed: {value: [Math.random() * 100, Math.random() * 100]}
      };


      copyUniforms(newUniforms, nebulaFilter.uniforms);

      var texture = this.renderNebula();

      copyUniforms(oldUniforms, nebulaFilter.uniforms);
      Math.random = oldRng;

      return texture;
    }
    renderNebula()
    {
      var layer = this.layers["bgFilter"];
      layer.filters = [this.shaderManager.shaders["nebula"]];

      var texture = layer.generateTexture(this.renderer, PIXI.SCALE_MODES.DEFAULT, 1, layer.filterArea);

      layer.filters = null;

      return texture;
    }
    renderBackground()
    {
      var texture = this.isBattleBackground ?
        this.renderBlurredNebula.apply(this, this.blurProps) :
        this.renderNebula();
      var sprite = new PIXI.Sprite(texture);

      this.layers["bgSprite"].removeChildren();
      this.layers["bgSprite"].addChild(sprite);

      this.backgroundIsDirty = false;
    }
    renderBlurredNebula(x: number, y: number, width: number, height: number, seed?: any)
    {
      var seed = seed || Math.random();
      var bg = new PIXI.Sprite(this.makeBackgroundTexture(seed));
      var fg = new PIXI.Sprite(this.makeBackgroundTexture(seed));

      var container = new PIXI.Container();
      container.addChild(bg);
      container.addChild(fg);

      var blurFilter = new PIXI.filters.BlurFilter();
      blurFilter.blur = 1;
      fg.filters = [blurFilter];
      fg.filterArea = new PIXI.Rectangle(x, y, width, height);

      var texture = container.generateTexture(this.renderer);//, PIXI.SCALE_MODES.DEFAULT, 1, bg.getLocalBounds());

      return texture;
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
