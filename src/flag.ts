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
      height?: number;
      mainColor?: number;
      secondaryColor?: number;
      tetriaryColor?: number;
    })
    {
      this.width = props.width;
      this.height = props.height || props.width;

      this.mainColor = props.mainColor;
      this.secondaryColor = props.secondaryColor;
      this.tetriaryColor = props.tetriaryColor;
    }

    setColorScheme(main, secondary?, tetriary?)
    {
      this.mainColor = main;

      
      this.secondaryColor = secondary;
      if (this.foregroundEmblem && isFinite(secondary))
      {
        this.foregroundEmblem.color = this.secondaryColor;
      }

      
      this.tetriaryColor = tetriary;
      if (this.backgroundEmblem && isFinite(tetriary))
      {
        this.backgroundEmblem.color = this.tetriaryColor;
      }
    }


    generateRandom(seed?: any)
    {
      this.seed = seed || Math.random();

      var rng = new RNG(this.seed);

      this.foregroundEmblem = new Emblem(this.secondaryColor);
      this.foregroundEmblem.generateRandom(1, rng);


      if (!this.foregroundEmblem.isForegroundOnly() && rng.uniform() > 0.5)
      {
        this.backgroundEmblem = new Emblem(this.tetriaryColor);
        this.backgroundEmblem.generateRandom(0.4, rng);
      }
    }
    clearContent()
    {
      this.customImage = null;
      this.foregroundEmblem = null;
      this.backgroundEmblem = null;
      this.seed = null;
    }
    setForegroundEmblem(emblem: Emblem)
    {
      this.clearContent();
      this.foregroundEmblem = emblem;
      if (isFinite(emblem.color) && emblem.color !== null)
      {
        this.secondaryColor = emblem.color;
      }
      else
      {
        emblem.color = this.secondaryColor
      }
    }
    setBackgroundEmblem(emblem: Emblem)
    {
      this.clearContent();
      this.backgroundEmblem = emblem;
      if (isFinite(emblem.color) && emblem.color !== null)
      {
        this.tetriaryColor = emblem.color;
      }
      else
      {
        emblem.color = this.tetriaryColor
      }
    }
    setCustomImage(imageSrc: string)
    {
      this.clearContent();
      this.customImage = imageSrc;
    }
    draw()
    {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      if (!isFinite(this.mainColor)) return canvas;

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
          xWidth = this.width;
        }

        if (image.height < this.height)
        {
          yPos = (this.height - image.height) / 2
          yHeight = image.height;
        }
        else
        {
          yPos = 0;
          yHeight = this.height;
        }

        console.log(xPos, yPos, xWidth, yHeight);


        ctx.drawImage(image, xPos, yPos, xWidth, yHeight);
      }
      else
      {
        if (this.backgroundEmblem && isFinite(this.tetriaryColor) && this.tetriaryColor !== null)
        {
          var background = this.backgroundEmblem.draw();
          var x = (this.width - background.width) / 2;
          var y = (this.height - background.height) / 2;
          ctx.drawImage(background, x, y);
        }

        if (this.foregroundEmblem && isFinite(this.secondaryColor) && this.secondaryColor !== null)
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

      if (isFinite(this.secondaryColor)) data.secondaryColor = this.secondaryColor;
      if (isFinite(this.tetriaryColor)) data.tetriaryColor = this.tetriaryColor;



      if (this.customImage)
      {
        data.customImage = this.customImage;
      }
      else if (this.seed)
      {
        data.seed = this.seed;
      }
      else
      {
        if (this.foregroundEmblem) data.foregroundEmblem = this.foregroundEmblem.serialize();
        if (this.backgroundEmblem) data.backgroundEmblem = this.backgroundEmblem.serialize();
      }

      return data;
    }
  }
}
