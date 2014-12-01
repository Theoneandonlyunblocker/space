/// <reference path="../lib/rng.d.ts" />
/// <reference path="emblem.ts" />

module Rance
{
  export class Flag
  {
    width: number;
    height: number;
    backgroundColor: number;
    backgroundEmblem: Emblem;
    foregroundEmblem: Emblem;

    seed: any;
    constructor(props:
    {
      width: number;
      height?: number;

      backgroundColor?: number;
      backgroundEmblem?: Emblem;
      foregroundEmblem?: Emblem;
    })
    {
      this.width = props.width;
      this.height = props.height || props.width;

      this.backgroundColor = props.backgroundColor;
      this.backgroundEmblem = props.backgroundEmblem;
      this.foregroundEmblem = props.foregroundEmblem;
    }
    generateRandom(seed?: any)
    {
      this.seed = seed || Math.random();

      var rng = new RNG(this.seed);

      if (!this.backgroundColor)
      {
        var hue = rng.random(0, 360) / 360;
        var saturation = rng.random(69, 100) / 100;
        var value = rng.random(69, 100) / 100;

        this.backgroundColor = hsvToHex(hue, saturation, value);
      }

      this.foregroundEmblem = new Emblem();
      this.foregroundEmblem.generateRandom(100, rng);

      if (!this.foregroundEmblem.isForegroundOnly() && rng.uniform() > 0.5)
      {
        this.backgroundEmblem = new Emblem();
        this.backgroundEmblem.generateRandom(40, rng);
      }

    }
    draw()
    {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = "#" + hexToString(this.backgroundColor);
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#00FF00";

      if (this.backgroundEmblem)
      {
        var background = this.backgroundEmblem.draw();
        var x = (this.width - background.width) / 2;
        var y = (this.height - background.height) / 2;
        ctx.drawImage(background, x, y);
      }

      var foreground = this.foregroundEmblem.draw();
      var x = (this.width - foreground.width) / 2;
      var y = (this.height - foreground.height) / 2;
      ctx.drawImage(foreground, x, y);
      
      return canvas;
    }
  }
}
