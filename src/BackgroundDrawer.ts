/// <reference path="../lib/pixi.d.ts" />

import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import
{
  generateTextureWithBounds,
} from "./utility";

export default class BackgroundDrawer
{
  public drawBackgroundFN: BackgroundDrawingFunction;
  public seed: string;
  public blurArea: PIXI.Rectangle;
  public pixiContainer: PIXI.Container;

  private containerElement: HTMLElement;
  private resizeBuffer:
  {
    width: number;
    height: number;
  } =
  {
    width: 15,
    height: 15,
  };
  private renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
  private hasExternalRenderer: boolean;
  private blurFilter: PIXI.filters.BlurFilter;
  private destroyBackgroundFN: () => void;
  private cachedBackgroundSize: PIXI.Rectangle;
  private layers:
  {
    bg: PIXI.DisplayObject;
    blur: PIXI.DisplayObject;
  } =
  {
    bg: null,
    blur: null,
  };

  constructor(props:
  {
    drawBackgroundFN: BackgroundDrawingFunction;
    seed: string;
    // if specified, this class won't create it's own renderer.
    // actions like resizing and binding the renderer view are also skipped
    renderer?: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
  })
  {
    this.drawBackgroundFN = props.drawBackgroundFN;
    this.seed = props.seed;

    this.blurFilter = new PIXI.filters.BlurFilter();
    this.blurFilter.blur = 1;
    this.pixiContainer = new PIXI.Container();

    this.setExternalRenderer(props.renderer);
  }
  public setExternalRenderer(renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer)
  {
    this.renderer = renderer;
    this.hasExternalRenderer = Boolean(renderer);
  }
  public destroy()
  {
    if (!this.hasExternalRenderer)
    {
      this.renderer.destroy(true);
      this.renderer = null;
    }
    this.containerElement = null;
    this.destroyOldBackground();
    this.pixiContainer.removeChildren();
    this.blurFilter = null;
  }
  public bindRendererView(containerElement: HTMLElement): void
  {
    if (this.hasExternalRenderer)
    {
      this.containerElement = containerElement;
      return;
    }
    if (this.containerElement)
    {
      this.containerElement.removeChild(this.renderer.view);
    }

    this.containerElement = containerElement;

    if (!this.renderer)
    {
      this.renderer = this.createRenderer();
    }

    this.containerElement.appendChild(this.renderer.view);
  }
  public handleResize(): void
  {
    if (!this.containerElement)
    {
      return;
    }

    const containerElementRect = this.getContainerElementRect();

    if (!this.hasExternalRenderer)
    {
      this.renderer.resize(containerElementRect.width, containerElementRect.height);
    }

    if (!this.cachedBackgroundSize ||
      this.isRectBiggerThanCachedBackground(containerElementRect))
    {
      this.drawScene();
    }

    if (this.blurArea)
    {
      this.setBlurMask();
    }

    if (!this.hasExternalRenderer)
    {
      this.renderer.render(this.pixiContainer);
    }
  }

  private drawBackground(): PIXI.DisplayObject
  {
    const backgroundSize = this.getDesiredBackgroundSize();
    const bg = this.drawBackgroundFN(this.seed, backgroundSize, this.renderer);
    this.destroyBackgroundFN = bg.destroy;
    this.cachedBackgroundSize = backgroundSize;
    return bg.displayObject;
  }
  private drawBlurredBackground(background: PIXI.DisplayObject): PIXI.DisplayObject
  {
    background.filters = [this.blurFilter];
    const blurTextureSize = this.getDesiredBlurSize();

    const blurTexture = generateTextureWithBounds(
      this.renderer, background, PIXI.settings.SCALE_MODE, this.renderer.resolution, blurTextureSize,
    );

    background.filters = null;

    const blurSprite = new PIXI.Sprite(blurTexture);
    return blurSprite;
  }
  private drawScene(): void
  {
    this.pixiContainer.removeChildren();
    this.destroyOldBackground();

    this.layers.bg = this.drawBackground();
    this.pixiContainer.addChild(this.layers.bg);

    if (this.blurArea)
    {
      this.layers.blur = this.drawBlurredBackground(this.layers.bg);
      this.pixiContainer.addChild(this.layers.blur);
    }
  }
  private setBlurMask(): void
  {
    if (!this.layers.blur.mask)
    {
      this.layers.blur.mask = new PIXI.Graphics();
    }

    const mask = <PIXI.Graphics> this.layers.blur.mask;
    mask.clear();
    mask.beginFill(0x000000);
    mask.drawShape(this.blurArea);
    mask.endFill();
  }
  private destroyOldBackground(): void
  {
    if (this.destroyBackgroundFN)
    {
      this.destroyBackgroundFN();
      this.destroyBackgroundFN = null;
    }
  }
  private createRenderer(): PIXI.CanvasRenderer | PIXI.WebGLRenderer
  {
    const renderer = PIXI.autoDetectRenderer(
      this.containerElement.clientWidth,
      this.containerElement.clientHeight,
      {
        autoResize: false,
        resolution: window.devicePixelRatio,
      },
    );

    renderer.view.setAttribute("id", "pixi-canvas");

    return renderer;
  }
  private addBufferToRect(rect: PIXI.Rectangle): PIXI.Rectangle
  {
    const cloned = rect.clone();
    cloned.width += this.resizeBuffer.width;
    cloned.height += this.resizeBuffer.height;

    return cloned;
  }
  private getDesiredBackgroundSize(): PIXI.Rectangle
  {
    return this.addBufferToRect(this.getContainerElementRect());
  }
  private getDesiredBlurSize(): PIXI.Rectangle
  {
    return this.cachedBackgroundSize;
  }
  private getContainerElementRect(): PIXI.Rectangle
  {
    const w = this.containerElement.clientWidth;
    const h = this.containerElement.clientHeight;
    return new PIXI.Rectangle(0, 0, w, h);
  }
  private isRectBiggerThanCachedBackground(toCheck: PIXI.Rectangle): boolean
  {
    return(
      toCheck.width > this.cachedBackgroundSize.width ||
      toCheck.height > this.cachedBackgroundSize.height
    );
  }
}
