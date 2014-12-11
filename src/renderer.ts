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
    backgroundIsDirty: boolean = true;

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
      if (this.renderer.view.parentNode)
      {
        this.renderer.view.parentNode.removeChild(this.renderer.view);
      }
      this.stage.removeChildren();

      for (var layerName in this.layers)
      {
        if (!this.layers[layerName]) continue;
        this.layers[layerName].filters = null;
        this.layers[layerName].removeChildren();
        this.layers[layerName] = null;
      }
    }
    bindRendererView()
    {
      this.pixiContainer.appendChild(this.renderer.view);
      this.renderer.view.setAttribute("id", "pixi-canvas");

      this.resize();
    }
    initLayers()
    {

      var _bgSprite = this.layers["bgSprite"] = new PIXI.DisplayObjectContainer();
      this.stage.addChild(_bgSprite);

      var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
      this.stage.addChild(_main);

      var _map = this.layers["map"] = new PIXI.DisplayObjectContainer();
      _main.addChild(_map);

      var _bgFilter = this.layers["bgFilter"] = new PIXI.DisplayObjectContainer();
      //_bgFilter.filters = [nebulaFilter];

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
      this.layers["bgFilter"].filters = [nebulaFilter];

      var texture = this.layers["bgFilter"].generateTexture();

      this.layers["bgFilter"].filters = null;

      return texture;
    }
    renderBackground()
    {
      var texture = this.renderNebula();
      var sprite = new PIXI.Sprite(texture);

      this.layers["bgSprite"].removeChildren();
      this.layers["bgSprite"].addChild(sprite);

      console.log("re-render shader")

      this.backgroundIsDirty = false;
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
        console.log("pause");
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

      if (this.backgroundIsDirty)
      {
        this.renderBackground();
      }

      uniformManager.updateTime();

      this.renderer.render(this.stage);

      requestAnimFrame( this.render.bind(this) );
    }
  }
}
