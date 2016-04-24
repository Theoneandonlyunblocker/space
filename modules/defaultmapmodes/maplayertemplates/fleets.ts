/// <reference path="../../../lib/pixi.d.ts" />

import Options from "../../../src/options";
import eventManager from "../../../src/eventManager";
import Fleet from "../../../src/Fleet";
import Star from "../../../src/Star";
import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";


const fleets: MapRendererLayerTemplate =
{
  key: "fleets",
  displayName: "Fleets",
  interactive: true,
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    var doc = new PIXI.Container();

    var points: Star[];
    if (!perspectivePlayer)
    {
      points = map.stars;
    }
    else
    {
      points = perspectivePlayer.getVisibleStars();
    }

    const mouseDownFN = function(fleet: Fleet, event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("mouseDown", event, fleet.location);
    }
    const mouseUpFN = function(event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("mouseUp", event);
    }
    const mouseOverFN = function(fleet: Fleet)
    {
      eventManager.dispatchEvent("hoverStar", fleet.location);
      if (Options.debugMode && fleet.units.length > 0 && fleet.units[0].front)
      {
        const objective = fleet.units[0].front.objective;
        const target = objective.target ? objective.target.id : null;
        console.log(objective.type, target, objective.priority);
      }
    }
    const fleetClickFN = function(fleet: Fleet, event: PIXI.interaction.InteractionEvent)
    {
      var originalEvent = <MouseEvent> event.data.originalEvent;;
      if (originalEvent.button === 0)
      {
        eventManager.dispatchEvent("selectFleets", [fleet]);
      }
    }
    function singleFleetDrawFN(fleet: Fleet)
    {
      var fleetContainer = new PIXI.Container();

      var color = fleet.player.color.getHex();
      var fillAlpha = fleet.isStealthy ? 0.3 : 0.7;

      var textTexture = getFleetTextTexture(fleet); // TODO layers
      var text = new PIXI.Sprite(textTexture);

      var containerGfx = new PIXI.Graphics();
      containerGfx.lineStyle(1, 0x00000, 1);
      // debug
      var front = fleet.units[0].front;
      if (front && Options.debugMode)
      {
        switch (front.objective.type)
        {
          case "discovery":
          {
            containerGfx.lineStyle(5, 0xFF0000, 1);
            break;
          }
          case "scoutingPerimeter":
          {
            containerGfx.lineStyle(5, 0x0000FF, 1);
            break;
          }
        }
      }
      // end debug
      containerGfx.beginFill(color, fillAlpha);
      containerGfx.drawRect(0, 0, text.width+4, text.height);
      containerGfx.endFill();


      fleetContainer.addChild(containerGfx);
      fleetContainer.addChild(text);
      text.x += 2;
      text.y -= 1;
      
      fleetContainer.interactive = true;
      
      const boundMouseDownFN = mouseDownFN.bind(null, fleet);
      const boundFleetClickFN = fleetClickFN.bind(null, fleet);
      fleetContainer.on("click", boundFleetClickFN);
      fleetContainer.on("tap", boundFleetClickFN);
      fleetContainer.on("mousedown", boundMouseDownFN);
      fleetContainer.on("mouseup", mouseUpFN);
      fleetContainer.on("rightdown", boundMouseDownFN);
      fleetContainer.on("rightup", mouseUpFN);
      fleetContainer.on("mouseover", mouseOverFN.bind(null, fleet));

      return fleetContainer;
    }

    for (let i = 0; i < points.length; i++)
    {
      var star = points[i];
      var fleets = star.getAllFleets();
      if (!fleets || fleets.length <= 0) continue;

      var fleetsContainer = new PIXI.Container();
      fleetsContainer.x = star.x;
      fleetsContainer.y = star.y - 40;

      for (let j = 0; j < fleets.length; j++)
      {
        if (fleets[j].units.length === 0)
        {
          continue;
        }
        if (fleets[j].isStealthy && perspectivePlayer && !perspectivePlayer.starIsDetected(fleets[j].location))
        {
          continue;
        }
        var drawnFleet = singleFleetDrawFN(fleets[j]);
        drawnFleet.position.x = fleetsContainer.width;
        fleetsContainer.addChild(drawnFleet);
      }

      if (fleetsContainer.children.length > 0)
      {
        fleetsContainer.x -= fleetsContainer.width / 2;
        doc.addChild(fleetsContainer);
      }
    }

    return doc;
  }
}

export default fleets;
