/// <reference path="../lib/rng.d.ts" />
/// <reference path="emblem.ts" />
/// <reference path="color.ts"/>

module Rance
{
  export class Flag
  {
    width: number;
    height: number;
    mainColor: number;
    secondaryColor: number;
    tetriaryColor: number;
    backgroundEmblem: Emblem;
    foregroundEmblem: Emblem;

    customImage: string;

    seed: any;
    constructor(props:
    {
      width: number;
      mainColor?: number;
      secondaryColor?: number;
      tetriaryColor?: number;

      height?: number;

      backgroundEmblem?: Emblem;
      foregroundEmblem?: Emblem;
    })
    {
      this.width = props.width;
      this.height = props.height || props.width;

      this.mainColor = props.mainColor;
      this.secondaryColor = props.secondaryColor;
      this.tetriaryColor = props.tetriaryColor;
      this.backgroundEmblem = props.backgroundEmblem;
      this.foregroundEmblem = props.foregroundEmblem;
    }
    generateRandom(seed?: any)
    {
      this.seed = seed || Math.random();

      var rng = new RNG(this.seed);

      this.foregroundEmblem = new Emblem(this.secondaryColor);
      this.foregroundEmblem.generateRandom(100, rng);


      if (!this.foregroundEmblem.isForegroundOnly() && rng.uniform() > 0.5)
      {
        this.backgroundEmblem = new Emblem(this.tetriaryColor);
        this.backgroundEmblem.generateRandom(40, rng);
      }
    }
    setForegroundEmblem(emblem: Emblem)
    {
      this.foregroundEmblem = emblem;
      this.secondaryColor = emblem.color;
      this.seed = null;
    }
    setBackgroundEmblem(emblem: Emblem)
    {
      this.backgroundEmblem = emblem;
      this.tetriaryColor = emblem.color;
      this.seed = null;
    }
    setCustomImage(imageSrc: string)
    {
      this.customImage = imageSrc;
      this.seed = null;
    }
    draw()
    {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = "#" + hexToString(this.mainColor);
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#00FF00";

      if (this.customImage)
      {
        var image = new Image();
        image.src = this.customImage;
        var xPos, xWidth, yPos, yHeight;

        // center image if smaller than canvas we're drawing on
        if (image.width < this.width)
        {
          xPos = (this.width - image.width) / 2
          xWidth = image.width;
        }
        else
        {
          xPos = 0;
          xWidth: this.width;
        }

        if (image.height < this.height)
        {
          yPos = (this.height - image.height) / 2
          yHeight = image.height;
        }
        else
        {
          yPos = 0;
          yHeight: this.height;
        }


        ctx.drawImage(image, xPos, yPos, xWidth, yHeight);
      }
      else
      {
        if (this.backgroundEmblem)
        {
          var background = this.backgroundEmblem.draw();
          var x = (this.width - background.width) / 2;
          var y = (this.height - background.height) / 2;
          ctx.drawImage(background, x, y);
        }

        if (this.foregroundEmblem)
        {
          var foreground = this.foregroundEmblem.draw();
          var x = (this.width - foreground.width) / 2;
          var y = (this.height - foreground.height) / 2;
          ctx.drawImage(foreground, x, y);
        }
      }
      
      
      return canvas;
    }
    serialize()
    {
      var data: any =
      {
        mainColor: this.mainColor
      };

      if (this.customImage)
      {
        data.customImage = this.customImage;
      }
      else if (this.seed)
      {
        data.seed = this.seed;
      }

      return data;

      /*
      return(
      {
        mainColor: this.mainColor,
        secondaryColor: this.secondaryColor,
        tetriaryColor: this.tetriaryColor,
        foregroundEmblemType: this.foregroundEmblem
        seed: this.seed
      });*/
    }
  }
}
