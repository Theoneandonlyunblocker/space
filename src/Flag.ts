/// <reference path="../lib/rng.d.ts" />

import Color from "./Color";
import Emblem from "./Emblem";
import {generateMainColor, generateSecondaryColor} from "./colorGeneration";

import FlagSaveData from "./savedata/FlagSaveData";

export class Flag
{
  public backgroundColor: Color | null;
  public emblems: Emblem[] = [];
  private seed: string;

  constructor(backgroundColor: Color | null, emblems?: Emblem[])
  {
    this.backgroundColor = backgroundColor;
    if (emblems)
    {
      emblems.forEach(emblem => this.addEmblem(emblem));
    }
  }

  public static generateRandom(
    backgroundColor: Color = generateMainColor(),
    secondaryColor: Color = generateSecondaryColor(backgroundColor),
    seed?: string,
  ): Flag
  {

    const flag = new Flag(backgroundColor);
    flag.seed = seed;
    flag.addRandomEmblem(secondaryColor, seed);

    return flag;
  }

  public draw(): HTMLDivElement
  {
    const container = document.createElement("div");

    // TODO 2017.12.21 |
    container.style.position = "relative";

    if (this.backgroundColor)
    {
      container.style.backgroundColor = `#${this.backgroundColor.getHexString()}`;
    }

    this.emblems.forEach(emblem =>
    {
      container.appendChild(emblem.draw());
    });

    return container;
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
  public serialize(): FlagSaveData
  {
    const data: FlagSaveData =
    {
      mainColor: this.backgroundColor.serialize(),
      emblems: this.emblems.map(emblem => emblem.serialize()),
    };

    return data;
  }
}
