const starLinks: MapRendererLayerTemplate =
{
  key: "starLinks",
  displayName: "Links",
  interactive: false,
  drawingFunction: function(map: GalaxyMap)
  {
    var doc = new PIXI.Container();

    var gfx = new PIXI.Graphics();
    doc.addChild(gfx);
    gfx.lineStyle(1, 0xCCCCCC, 0.6);

    var points: Star[];
    if (!this.player)
    {
      points = map.stars;
    }
    else
    {
      points = this.player.getRevealedStars();
    }

    var starsFullyConnected:
    {
      [id: number]: boolean;
    } = {};

    for (var i = 0; i < points.length; i++)
    {
      var star = points[i];
      if (starsFullyConnected[star.id]) continue;

      starsFullyConnected[star.id] = true;

      for (var j = 0; j < star.linksTo.length; j++)
      {
        gfx.moveTo(star.x, star.y);
        gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
      }
      for (var j = 0; j < star.linksFrom.length; j++)
      {
        gfx.moveTo(star.linksFrom[j].x, star.linksFrom[j].y);
        gfx.lineTo(star.x, star.y);
      }
    }
    return doc;
  }
}