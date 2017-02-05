/// <reference path="../lib/rng.d.ts" />

import Color from "./Color";
import {generateMainColor, generateSecondaryColor} from "./colorGeneration";
import Emblem from "./Emblem";
import
{
  drawElementToCanvas,
} from "./utility";

import FlagSaveData from "./savedata/FlagSaveData";

export class Flag
{
  private seed: string;
  private backgroundColor: Color | null;
  private emblems: Emblem[] = [];

  private cachedCanvases:
  {
    [sizeString: string]: HTMLCanvasElement;
  } = {};

  constructor(backgroundColor: Color | null, emblems?: Emblem[])
  {
    this.backgroundColor = backgroundColor;
    if (emblems)
    {
      emblems.forEach((emblem) => this.addEmblem(emblem));
    }
  }
  public static generateRandom(
    backgroundColor: Color = generateMainColor(),
    secondaryColor: Color = generateSecondaryColor(backgroundColor),
    seed?: string
  ): Flag
  {

    const flag = new Flag(backgroundColor);
    flag.seed = seed;
    flag.addRandomEmblem(secondaryColor, seed);

    return flag;
  }
  public generateRandomEmblem(secondaryColor?: Color, seed?: string): Emblem
  {
    return Emblem.generateRandom(this.backgroundColor, [secondaryColor], 1, seed);
  }
  public addRandomEmblem(secondaryColor?: Color, seed?: string): void
  {
    this.addEmblem(this.generateRandomEmblem(secondaryColor, seed));
  }
  public addEmblem(emblem: Emblem): void
  {
    this.emblems.push(emblem);
  }
  // public setCustomImage(...args: any[]): void
  // {

  // }
  public getCanvas(
    width: number,
    height: number,
    stretch: boolean = true,
    useCache: boolean = true
  ): HTMLCanvasElement
  {
    if (useCache)
    {
      const sizeString = "" + width + "," + height + stretch;
      if (!this.cachedCanvases[sizeString])
      {
        const canvas = this.draw(width, height, stretch);
        this.cachedCanvases[sizeString] = canvas;
      }

      const cachedCanvas = this.cachedCanvases[sizeString];
      const canvas = drawElementToCanvas(cachedCanvas);

      return canvas;
    }
    else
    {
      const canvas = this.draw(width, height, stretch);
      return canvas;
    }
  }
  public isDrawable(): boolean
  {
    return true; // TODO 29.9.2016 | ?
  }
  public serialize(): FlagSaveData
  {
    const data: FlagSaveData =
    {
      mainColor: this.backgroundColor.serialize(),
      emblems: this.emblems.map((emblem) => emblem.serialize()),
    };

    return data;
  }


  private draw(width: number, height: number, stretch: boolean = true): HTMLCanvasElement
  {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "source-over";
    if (this.backgroundColor)
    {
      ctx.fillStyle = "#" + this.backgroundColor.getHexString();
      ctx.fillRect(0, 0, width, height);
    }

    this.emblems.forEach((emblem) =>
    {
      if (emblem.isDrawable())
      {
        const foreground = emblem.draw(width, height, stretch);
        const x = (width - foreground.width) / 2;
        const y = (height - foreground.height) / 2;
        ctx.drawImage(foreground, x, y);
      }
    });

    return canvas;
  }
  // getReactMarkup()
  // {
  //   if (!this._reactMarkup)
  //   {
  //     var tempContainer = document.createElement("div");
  //     tempContainer.appendChild(this.drawSvg());

  //     this._reactMarkup =
  //     {
  //       __html: tempContainer.innerHTML
  //     }
  //   }

  //   return this._reactMarkup;
  // }
  // drawSvg(): HTMLElement
  // {
  //   if (!this._renderedSvg)
  //   {
  //     var container = document.createElement("div");
  //     container.classList.add("player-flag");
  //     container.style.backgroundColor = "#" + hexToString(this.mainColor);

  //     if (this.backgroundEmblem && isFinite(this.tetriaryColor) && this.tetriaryColor !== null)
  //     {
  //       container.appendChild(this.backgroundEmblem.drawSvg());
  //     }
  //     if (this.foregroundEmblem && isFinite(this.secondaryColor) && this.secondaryColor !== null)
  //     {
  //       container.appendChild(this.foregroundEmblem.drawSvg());
  //     }

  //     this._renderedSvg = container;
  //   }

  //   return this._renderedSvg;
  // }
}
