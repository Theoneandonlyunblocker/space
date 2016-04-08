const ownerBorders: MapRendererLayerTemplate =
{
  key: "ownerBorders",
  displayName: "Owner borders",
  interactive: false,
  alpha: 0.7,
  drawingFunction: function(map: GalaxyMap)
  {
    var doc = new PIXI.Container();
    if (Options.display.borderWidth <= 0)
    {
      return doc;
    }

    var revealedStars = this.player.getRevealedStars();
    var borderEdges = getRevealedBorderEdges(revealedStars, map.voronoi);

    for (var i = 0; i < borderEdges.length; i++)
    {
      var gfx = new PIXI.Graphics();
      doc.addChild(gfx);
      var polyLineData = borderEdges[i];
      var player = polyLineData.points[0].star.owner;
      gfx.lineStyle(Options.display.borderWidth, player.secondaryColor, 1);

      var polygon = new PIXI.Polygon(polyLineData.points);
      polygon.closed = polyLineData.isClosed;
      gfx.drawShape(polygon);
    }

    return doc;
  }
}