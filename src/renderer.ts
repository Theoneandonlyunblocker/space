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

    constructor()
    {
    }
    init()
    {
      PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
      
      this.stage = new PIXI.Stage(0xFFFF00);

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

      this.addEventListeners()
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
    }
    initLayers()
    {
      var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
      this.stage.addChild(_main);

      var _map = this.layers["map"] = new PIXI.DisplayObjectContainer();
      _main.addChild(_map);

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

      var main = this.layers["map"];
      main.interactive = true;

      main.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);

      main.mousedown = main.rightdown = main.touchstart = function(event)
      {
        self.mouseEventHandler.mouseDown(event, "world");
      }
      main.mousemove = main.touchmove = function(event)
      {
        self.mouseEventHandler.mouseMove(event, "world");
      }
      main.mouseup = main.rightup = main.touchend = function(event)
      {
        self.mouseEventHandler.mouseUp(event, "world");
      }
      main.mouseupoutside = main.rightupoutside = main.touchendoutside = function(event)
      {
        self.mouseEventHandler.mouseUp(event, "world");
      }
    }
    resize()
    {
      if (this.renderer)
      {
        this.renderer.resize(this.pixiContainer.offsetWidth, this.pixiContainer.offsetHeight);
      }
    }
    render()
    {
      this.renderer.render(this.stage);
      requestAnimFrame( this.render.bind(this) );
    }
  }
}
