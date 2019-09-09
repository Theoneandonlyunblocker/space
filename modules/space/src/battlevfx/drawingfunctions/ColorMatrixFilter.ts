import * as PIXI from "pixi.js";

import {Color} from "core/src/color/Color";


export class ColorMatrixFilter extends PIXI.filters.ColorMatrixFilter
{
  constructor()
  {
    super();
  }

  public multiplyByMatrix(matrix: number[]): void
  {
    this._loadMatrix(matrix, true);
  }
  public addMatrix(matrix: number[]): void
  {
    if (matrix.length !== this.matrix.length)
    {
      throw new Error("Matrix must be 5x4");
    }

    this.matrix = this.matrix.map((oldValue, i) =>
    {
      return oldValue + matrix[i];
    });
  }
  public addColor(color: Color): void
  {
    const rgb = color.getRGB();
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const matrix =
    [
      0, 0, 0, 0, r,
      0, 0, 0, 0, g,
      0, 0, 0, 0, b,
      0, 0, 0, 0, 0,
    ];

    this.addMatrix(matrix);
  }
  public multiplyRGB(amount: number): void
  {
    this.multiplyByColor(new Color(amount, amount, amount));
  }
  public multiplyByColor(color: Color): void
  {
    const rgb = color.getRGB();
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const matrix =
    [
      r, 0, 0, 0, 0,
      0, g, 0, 0, 0,
      0, 0, b, 0, 0,
      0, 0, 0, 1, 0,
    ];

    this.multiplyByMatrix(matrix);
  }
}
