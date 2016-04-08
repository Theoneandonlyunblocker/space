/// <reference path="../../../lib/pixi.d.ts" />


const resources: MapRendererLayerTemplate =
{
  key: "resources",
  displayName: "Resources",
  interactive: false,
  drawingFunction: function(map: GalaxyMap)
  {
    var self = this;

    var doc = new PIXI.Container();

    var points: Star[];
    if (!this.player)
    {
      points = map.stars;
    }
    else
    {
      points = this.player.getRevealedStars();
    }

    for (var i = 0; i < points.length; i++)
    {
      var star = points[i];
      if (!star.resource) continue;

      var text = new PIXI.Text(star.resource.displayName,
      {
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2
      });

      text.x = star.x;
      text.x -= text.width / 2;
      text.y = star.y + 8;

      doc.addChild(text);
    }

    return doc;
  }
}