/// <reference path="../lib/pixi.d.ts" />

/// <reference path="camera.ts"/>
/// <reference path="mouseeventhandler.ts"/>
/// <reference path="shadermanager.ts"/>

module Rance
{
  export class Renderer
  {
    stage: PIXI.Stage;
    renderer: any; //PIXI.Renderer
    pixiContainer: HTMLCanvasElement;
    layers:
    {
      [name: string] : PIXI.DisplayObjectContainer;
    } = {};
    camera: Camera;
    mouseEventHandler: MouseEventHandler;
    shaderManager: ShaderManager;
    isPaused: boolean = false;
    forceFrame: boolean = false;
    backgroundIsDirty: boolean = true;
    isBattleBackground: boolean = false;
    blurProps: number[];

    resizeListener: any;

    constructor()
    {
      PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
      
      this.stage = new PIXI.Stage(0x101060);
      this.shaderManager = new ShaderManager();
    }
    init()
    {
      this.initLayers();

      this.addEventListeners();
    }
    initRenderer()
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
    destroy()
    {
      this.pause();

      //window.removeEventListener("resize", this.resizeListener);

      this.mouseEventHandler.destroy();
      this.camera.destroy();

      this.layers["bgFilter"].filters = null;

      this.stage.removeChildren();
      this.removeRendererView();
    }
    removeRendererView()
    {
      if (this.renderer.view.parentNode)
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
      var _bgSprite = this.layers["bgSprite"] = new PIXI.DisplayObjectContainer();

      var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();

      var _map = this.layers["map"] = new PIXI.DisplayObjectContainer();

      var _bgFilter = this.layers["bgFilter"] = new PIXI.DisplayObjectContainer();

      var _select = this.layers["select"] = new PIXI.DisplayObjectContainer();

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
      if (this.mouseEventHandler) this.mouseEventHandler.destroy();
      if (this.camera) this.camera.destroy();
      this.camera = new Camera(this.layers["main"], 0.5);
      this.mouseEventHandler = new MouseEventHandler(this, this.camera);
    }
    addEventListeners()
    {
      var self = this;
      this.resizeListener = this.resize.bind(this);
      window.addEventListener("resize", this.resizeListener, false);


      this.stage.mousedown = this.stage.rightdown = this.stage.touchstart = function(event)
      {
        self.mouseEventHandler.mouseDown(event, "stage");
      }
      this.stage.mousemove = this.stage.touchmove = function(event)
      {
        self.mouseEventHandler.mouseMove(event, "stage");
      }
      this.stage.mouseup = this.stage.rightup = this.stage.touchend = function(event)
      {
        self.mouseEventHandler.mouseUp(event, "stage");
      }
      this.stage.mouseupoutside = this.stage.rightupoutside = this.stage.touchendoutside = function(event)
      {
        self.mouseEventHandler.mouseUp(event, "stage");
      }

      var main = this.layers["bgSprite"];
      main.interactive = true;

      main.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);

      main.mousedown = main.rightdown = main.touchstart = function(event)
      {
        if (event.target !== main) return;
        self.mouseEventHandler.mouseDown(event, "world");
      }
      main.mousemove = main.touchmove = function(event)
      {
        if (event.target !== main) return;
        self.mouseEventHandler.mouseMove(event, "world");
      }
      main.mouseup = main.rightup = main.touchend = function(event)
      {
        if (event.target !== main) return;
        self.mouseEventHandler.mouseUp(event, "world");
      }
      main.mouseupoutside = main.rightupoutside = main.touchendoutside = function(event)
      {
        if (event.target !== main) return;
        self.mouseEventHandler.mouseUp(event, "world");
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
      function copyUniforms(uniformObj, target?)
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
      this.layers["bgFilter"].filters = [this.shaderManager.shaders["nebula"]];

      var texture = this.layers["bgFilter"].generateTexture();

      this.layers["bgFilter"].filters = null;

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

      var container = new PIXI.DisplayObjectContainer();
      container.addChild(bg);
      container.addChild(fg);

      fg.filters = [new PIXI.BlurFilter()];
      fg.filterArea = new PIXI.Rectangle(x, y, width, height);

      var texture = container.generateTexture();

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
      this.render();
    }
    render()
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

      requestAnimFrame( this.render.bind(this) );
    }
  }
}
