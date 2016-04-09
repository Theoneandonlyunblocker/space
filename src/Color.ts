/// <reference path="../lib/husl.d.ts" />

import ColorSaveData from "./savedata/ColorSaveData.d.ts";

export default class Color
{
  // 0.0-1.0
  r: number;
  g: number;
  b: number;
  
  constructor(r: number, g: number, b: number)
  {
    this.r = r; 
    this.g = g; 
    this.b = b; 
  }
  // 0x000000-0xFFFFFF
  public static fromHex(hex: number): Color
  {
    return new Color(
      (hex >> 16 & 0xFF) / 255,
      (hex >> 8 & 0xFF) / 255,
      (hex & 0xFF) / 255
    );
  }
  // 0-1
  public static fromHSV(h: number, s: number, v: number): Color
  {
    var r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6)
    {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return new Color(r, g, b);
  }
  // 0-1
  public static fromHSL(h: number, s: number, l: number): Color
  {
    let r: number, g: number, b: number;

    if (s == 0)
    {
      r = g = b = l; // achromatic
    }
    else
    {
      function hue2rgb(p: number, q: number, t: number): number
      {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p: number = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return new Color(r, g, b);
  }
  // 0-1
  public static fromHUSL(h: number, s: number, l: number): Color
  {
    const RGB = HUSL.toRGB(h * 360, s * 100, l * 100);
    return new Color(RGB[0], RGB[1], RGB[2]);
  }
  
  // 0-1
  public getRGB(): number[]
  {
    return [this.r, this.g, this.b];
  }
  // 0-1
  public getRGBA(alpha: number): number[]
  {
    return [this.r, this.g, this.b, alpha];
  }
  // 0-255
  public get8BitRGB(): number[]
  {
    return this.getRGB().map((x: number) => x * 255);
  }
  
  // 0x000000-0xFFFFFF
  public getHex(): number
  {
    return (this.r * 255 << 16) + (this.g * 255 << 8) + this.b * 255;
  }
  // "000000"-"FFFFFF"
  public getHexString(): string
  {
    const hex = Math.round(this.getHex());
    const converted = hex.toString(16);
    return '000000'.substr(0, 6 - converted.length) + converted;
  }
  
  // 0-1
  public getHUSL(): number[]
  {
    const husl = HUSL.fromRGB(this.r, this.g, this.b);
    return [husl[0] / 360, husl[1] / 100, husl[2] / 100];
  }
  
  public serialize(): ColorSaveData
  {
    return this.getRGB();
  }
  public static deSerialize(saveData?: ColorSaveData): Color
  {
    if (!saveData)
    {
      return undefined;
    }
    
    return new Color(saveData[0], saveData[1], saveData[2]);
  }
}