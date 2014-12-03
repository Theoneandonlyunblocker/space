/// <reference path="../lib/rng.d.ts" />
/// <reference path="emblem.ts" />
/// <reference path="color.ts"/>

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
      backgroundColor: number;

      height?: number;

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

      this.foregroundEmblem = new Emblem();
      this.foregroundEmblem.generateRandom(100, rng);

      if (Math.random() < 0.5)
      {
        this["emblemType"] = "husl";
        var huslColor = hexToHusl(this.backgroundColor);
        var contrastingColor = makeContrastingColor(
        {
          color: huslColor,
          minDifference:
          {
            h: 30,
            l: 30
          },
          maxDifference:
          {
            h: 80,
            l: 60
          }
        });
        var contrastingHex = stringToHex(HUSL.toHex.apply(null, contrastingColor));
      }
      else
      {
        this["emblemType"] = "hsv";
        function contrasts(c1, c2)
        {
          return(
            (c1[2] < c2[2] - 20 || c1[2] > c2[2] + 20)
          );
        }
        function makeColor(c1, easing)
        {
          var hsvColor = hexToHsv(c1); // scalar

          hsvColor = colorFromScalars(hsvColor);
          var contrastingColor = makeContrastingColor(
          {
            color: hsvColor,
            initialRanges:
            {
              l: {min: 60 * easing, max: 100}
            },
            minDifference:
            {
              h: 20 * easing,
              s: 30 * easing
            },
            maxDifference:
            {
              h: 100
            }
          });

          var contrastingHex = <number> hsvToHex.apply(null, scalarsFromColor( contrastingColor ));

          return hexToHusl(contrastingHex);
        }

        var huslBg = hexToHusl(this.backgroundColor);
        var easing = 1;
        var candidateColor = makeColor(this.backgroundColor, easing);

        while (!contrasts(huslBg, candidateColor))
        {
          easing -= 0.1;
          candidateColor = makeColor(this.backgroundColor, easing);
        }

        var contrastingHex = stringToHex(HUSL.toHex.apply(null, candidateColor));
      }

      this.foregroundEmblem.color = contrastingHex;

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
