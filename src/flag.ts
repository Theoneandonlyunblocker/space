/// <reference path="../lib/rng.d.ts" />
/// <reference path="emblem.ts" />
/// <reference path="color.ts"/>

module Rance
{
  export class Flag
  {
    seed: any;
    width: number;
    height: number;
    mainColor: number;
    secondaryColor: number;
    tetriaryColor: number;
    backgroundEmblem: Emblem;
    foregroundEmblem: Emblem;
    private _renderedSvg: HTMLElement;

    customImage: string;
    private _customImageToRender: HTMLCanvasElement;

    cachedCanvases:
    {
      [sizeString: string]:
      {
        canvas: HTMLCanvasElement;
        dataURL: string;
      }
    } = {};

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
      this.tetriaryColor = props.tetriaryColor; // TODO currently never set
    }
    setColorScheme(main: number, secondary?: number, tetriary?: number)
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


      if (this.foregroundEmblem.canAddBackground() && rng.uniform() > 0.5)
      {
        this.backgroundEmblem = new Emblem(this.tetriaryColor);
        this.backgroundEmblem.generateRandom(0.4, rng);
      }
    }
    clearContent()
    {
      this.customImage = null;
      this._customImageToRender = null;
      this.foregroundEmblem = null;
      this.backgroundEmblem = null;
      this.seed = null;
    }
    setForegroundEmblem(emblem: Emblem)
    {
      if (!emblem)
      {
        this.foregroundEmblem = null;
        return;
      }

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
      if (!emblem)
      {
        this.backgroundEmblem = null;
        return;
      }

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
    // TODO custom images
    setCustomImage(imageSrc: string)
    {
      this.clearContent();
      this.customImage = imageSrc;

      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");

      var image = new Image();
      image.src = imageSrc
      var xPos: number, xWidth: number, yPos: number, yHeight: number;

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

      ctx.drawImage(image, xPos, yPos, xWidth, yHeight);

      this._customImageToRender = canvas;
    }
    getCanvas(width: number, height: number, stretch: boolean = true, useCache: boolean = true)
    {
      if (useCache)
      {
        var sizeString = "" + width + "," + height + stretch;
        if (!this.cachedCanvases[sizeString])
        {
          var canvas = this.draw(width, height, stretch);
          this.cachedCanvases[sizeString] =
          {
            canvas: canvas,
            dataURL: canvas.toDataURL()
          }
        }

        return this.cachedCanvases[sizeString];
      }
      else
      {
        var canvas = this.draw(width, height, stretch);
        return(
        {
          canvas: canvas,
          dataURL: canvas.toDataURL()
        });
      }
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
    draw(width: number = this.width, height: number = this.height, stretch: boolean = true)
    {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      if (!isFinite(this.mainColor)) return canvas;

      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = "#" + hexToString(this.mainColor);
      ctx.fillRect(0, 0, width, height);

      if (this._customImageToRender)
      {
        ctx.drawImage(this._customImageToRender, 0, 0);
      }
      else
      {
        if (this.backgroundEmblem && isFinite(this.tetriaryColor) && this.tetriaryColor !== null)
        {
          var background = this.backgroundEmblem.draw(width, height, stretch);
          var x = (width - background.width) / 2;
          var y = (height - background.height) / 2;
          ctx.drawImage(background, x, y);
        }

        if (this.foregroundEmblem && isFinite(this.secondaryColor) && this.secondaryColor !== null)
        {
          var foreground = this.foregroundEmblem.draw(width, height, stretch);
          var x = (width - foreground.width) / 2;
          var y = (height - foreground.height) / 2;
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
