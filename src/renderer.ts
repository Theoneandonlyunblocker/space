/// <reference path="../lib/pixi.d.ts" />

/// <reference path="camera.ts"/>
/// <reference path="mouseeventhandler.ts"/>

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
    isPaused: boolean = false;
    forceFrame: boolean = false;
    bgFilterIsDirty: boolean = true;
    bgSpriteIsDirty: boolean = true;

    constructor()
    {
      PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
      
      this.stage = new PIXI.Stage(0x101060);
    }
    init()
    {

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
      else
      {
        this.removeRendererView();
      }


      this.initLayers();
      this.addCamera();

      this.addEventListeners();
    }
    setContainer(element: HTMLCanvasElement)
    {
      this.pixiContainer = element;
    }
    removeRendererView()
    {
      this.renderer.view.parentNode.removeChild(this.renderer.view);
    }
    bindRendererView()
    {
      this.pixiContainer.appendChild(this.renderer.view);
      this.renderer.view.setAttribute("id", "pixi-canvas");

      this.resize();
    }
    initLayers()
    {
      this.stage.removeChildren();

      for (var layerName in this.layers)
      {
        this.layers[layerName].filters = null;
        this.layers[layerName].removeChildren();
        this.layers[layerName] = null;
      }

      var _bgSprite = this.layers["bgSprite"] = new PIXI.DisplayObjectContainer();
      this.stage.addChild(_bgSprite);

      var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
      this.stage.addChild(_main);

      var _map = this.layers["map"] = new PIXI.DisplayObjectContainer();
      _main.addChild(_map);

      var _bgFilter = this.layers["bgFilter"] = new PIXI.DisplayObjectContainer();
      _bgFilter.filters = [nebulaFilter];

      var _select = this.layers["select"] = new PIXI.DisplayObjectContainer();
      _main.addChild(_select);


    }
    addCamera()
    {
      this.camera = new Camera(this.layers["main"], 0.5);
      this.mouseEventHandler = new MouseEventHandler(this, this.camera);
    }
    addEventListeners()
    {
      
      var self = this;
      window.addEventListener("resize", this.resize.bind(this), false);


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
        this.bgFilterIsDirty = true;
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
          console.log("force")
          this.forceFrame = false;
        }
        else
        {
          return;
        }
      }

      if (this.bgFilterIsDirty)
      {
        this.stage.addChild(this.layers["bgFilter"]);
        this.layers["bgFilter"].filters = [nebulaFilter];
        this.bgFilterIsDirty = false;
        this.bgSpriteIsDirty = true;
      }

      uniformManager.updateTime();

      if (this.bgSpriteIsDirty)
      {
        var texture = this.layers["bgFilter"].generateTexture();
        var sprite = new PIXI.Sprite(texture);

        this.layers["bgSprite"].removeChildren();
        this.layers["bgSprite"].addChild(sprite);

        this.layers["bgFilter"].filters = null;
        this.stage.removeChild(this.layers["bgFilter"]);

        this.bgSpriteIsDirty = false;
      }

      this.renderer.render(this.stage);

      requestAnimFrame( this.render.bind(this) );
    }
  }
}
