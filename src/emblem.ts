module Rance
{
  export interface SubEmblem
  {
    type: string; //inner, outer, either, both
    imageSrc: string;
  }
  export class Emblem
  {
    alpha: number;
    color: number;
    outer: SubEmblem;
    inner?: SubEmblem;
    constructor()
    {
      
    }

    draw()
    {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = this.alpha;

      var outer = this.drawSubEmblem(this.outer);
      var inner = this.drawSubEmblem(this.inner);

      ctx.drawImage(outer);
      ctx.drawImage(inner);

      return canvas;
    }

    drawSubEmblem(toDraw: SubEmblem)
    {
      var image = new Image();
      image.src = toDraw.imageSrc;

      var width = image.width;
      var height = image.height;

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0);

      ctx.globalCompositeOperation = "source-in";

      ctx.fillStyle = "#" + hexToString(this.color);
      ctx.fillRect(0, 0, width, height);

      return canvas;
    }
  }
}
