/// <reference path="../lib/pixi.d.ts" />
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import
{
  roundToNearestMultiple
} from "./utility";

export default class BackgroundDrawer
{
  public drawBackgroundFN: BackgroundDrawingFunction;
  public containerElement: HTMLElement;
  public seed: string;
  
  private resizeBuffer:
  {
    width: number;
    height: number;
  } =
  {
    width: 15,
    height: 15
  };
  private renderer: PIXI.SystemRenderer;
  private blurArea: PIXI.Rectangle;
  private blurFilter: PIXI.filters.BlurFilter;

  constructor(props:
  {
    drawBackgroundFN: BackgroundDrawingFunction;
    seed: string;
  })
  {
    this.drawBackgroundFN = props.drawBackgroundFN;
    this.seed = props.seed;
    
    this.blurFilter = new PIXI.filters.BlurFilter();
    this.blurFilter.blur = 1;
  }
  public bindRendererView(containerElement: HTMLElement): void
  {
    if (this.containerElement)
    {
      this.containerElement.removeChild(this.renderer.view);
    }
    
    this.containerElement = containerElement;
    
    if (!this.renderer)
    {
      this.renderer = this.createRenderer();
    }
    else
    {
      this.handleResize();
    }
    
    this.containerElement.appendChild(this.renderer.view);
  }
  public renderBackground(): void
  {
    const bg = this.drawBackground();
    if (this.blurArea)
    {
      bg.filterArea = this.blurArea;
      bg.filters = [this.blurFilter];
    }
    else
    {
      bg.filters = [];
    }
    
    this.renderer.render(bg);
  }
  public setBlurArea(blurArea: PIXI.Rectangle): void
  {
    this.blurArea = blurArea;
  }
  
  private createRenderer(): PIXI.SystemRenderer
  {
    const renderer = PIXI.autoDetectRenderer(
      this.containerElement.clientWidth,
      this.containerElement.clientHeight,
      {
        autoResize: false,
        resolution: window.devicePixelRatio
      }
    );
    
    renderer.view.setAttribute("id", "pixi-canvas");
    
    return renderer;
  }
  private drawBackground(): PIXI.DisplayObject
  {
    return this.drawBackgroundFN(this.seed, this.getDisplayObjectSize(), this.renderer);
  }
  private getDisplayObjectSize(): PIXI.Rectangle
  {
    const w = this.renderer.width;
    const h = this.renderer.height;
    const rendererRect = new PIXI.Rectangle(0, 0, w, h);
    return this.roundRectangleToNearestBreakPoint(rendererRect);
  }
  private handleResize(): void
  {
    if (!this.containerElement)
    {
      return;
    }
    
    const w = this.containerElement.clientWidth;
    const h = this.containerElement.clientHeight;
    const containerElementRect = new PIXI.Rectangle(0, 0, w, h);
    
    if (!this.isRectWithinBufferLimit(containerElementRect))
    {
      this.renderer.resize(w, h);
      this.drawBackground();
    }
  }
  private roundRectangleToNearestBreakPoint(rect: PIXI.Rectangle): PIXI.Rectangle
  {
    const resizeBufferW2 = this.resizeBuffer.width / 2;
    const resizeBufferH2 = this.resizeBuffer.height / 2;
    const w = roundToNearestMultiple(
      rect.width + resizeBufferW2, this.resizeBuffer.width);
    const h = roundToNearestMultiple(
      rect.height + resizeBufferH2, this.resizeBuffer.height);
      
    return new PIXI.Rectangle(0, 0, w, h);
  }
  private isRectWithinBufferLimit(toCheck: PIXI.Rectangle): boolean
  {
    const minWidth = this.renderer.width - this.resizeBuffer.width;
    const maxWidth = this.renderer.width + this.resizeBuffer.width;
    const widthFits = toCheck.width > minWidth && toCheck.width < maxWidth;
    
    if (widthFits)
    {
      const minHeight = this.renderer.height - this.resizeBuffer.height;
      const maxHeight = this.renderer.height + this.resizeBuffer.height;
      const heightFits = toCheck.height > minHeight && toCheck.height < maxHeight;
      
      return heightFits;
    }
    
    return false;
  }
}
