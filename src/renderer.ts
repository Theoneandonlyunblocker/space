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

    animFrameId: any;

    constructor()
    {
      PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
      
      this.stage = new PIXI.Stage(0xFFFF00);
      this.initLayers();
    }
    init()
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

      this.initLayers();
      this.addCamera();

      this.addEventListeners()
    }
    setContainer(element: HTMLCanvasElement)
    {
      this.pixiContainer = element;
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
    }
    addCamera()
    {
      this.camera = new Camera(this.layers["main"], 0.5);
      this.mouseEventHandler = new MouseEventHandler(this.camera);
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
    }
    resize()
    {
      if (this.renderer)
      {
        this.renderer.resize(this.pixiContainer.offsetWidth, this.pixiContainer.offsetHeight);
      }
    }
    stopRender()
    {
      if (!this.animFrameId) return;

      window.cancelAnimationFrame(this.animFrameId);
    }
    render()
    {
      this.renderer.render(this.stage);
      this.animFrameId = requestAnimFrame( this.render.bind(this) );
    }
  }
}
