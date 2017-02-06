/// <reference path="../../../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import app from "../../../src/App";
import {Fleet} from "../../../src/Fleet";
import GalaxyMap from "../../../src/GalaxyMap";
import Options from "../../../src/Options";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import eventManager from "../../../src/eventManager";

import attachedUnitData from "../../common/attachedUnitData";


const fleets: MapRendererLayerTemplate =
{
  key: "fleets",
  displayName: "Fleets",
  interactive: true,
  destroy: function()
  {
    for (let fleetSize in fleetTextTextureCache)
    {
      fleetTextTextureCache[fleetSize].destroy(true);
      fleetTextTextureCache[fleetSize] = null;
      delete fleetTextTextureCache[fleetSize];
    }
  },
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
    };
    const mouseUpFN = function(event: PIXI.interaction.InteractionEvent)
    {
      eventManager.dispatchEvent("mouseUp", event);
    };
    const mouseOverFN = function(fleet: Fleet)
    {
      eventManager.dispatchEvent("hoverStar", fleet.location);

      if (Options.debug.enabled && fleet.units.length > 0)
      {
        const front = attachedUnitData.get(fleet.units[0]).front;
        console.log(`${fleet.id}${front ? ", " + front.objective.type : ""}`);
      }
    };
    const fleetClickFN = function(fleet: Fleet, event: PIXI.interaction.InteractionEvent)
    {
      var originalEvent = <MouseEvent> event.data.originalEvent;;
      if (originalEvent.button === 0)
      {
        eventManager.dispatchEvent("selectFleets", [fleet]);
      }
    };
    function singleFleetDrawFN(fleet: Fleet)
    {
      var fleetContainer = new PIXI.Container();

      var color = fleet.player.color.getHex();
      var fillAlpha = fleet.isStealthy ? 0.3 : 0.7;

      var textTexture = getFleetTextTexture(fleet);
      var text = new PIXI.Sprite(textTexture);

      var containerGfx = new PIXI.Graphics();
      containerGfx.lineStyle(1, 0x00000, 1);
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
      var fleets = star.getFleets();
      if (!fleets || fleets.length < 1)
      {
        continue;
      }

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
  },
};

export default fleets;

const fleetTextTextureCache:
{
  [fleetSize: number]: PIXI.Texture;
} = {};
function getFleetTextTexture(fleet: Fleet)
{
  var fleetSize = fleet.units.length;

  if (!fleetTextTextureCache[fleetSize])
  {
    var text = new PIXI.Text("" + fleetSize,
    {
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 3,
    });

    // TODO PIXI4 | triggers bounds update that gets skipped if we just call generateTexture()
    // TODO 02.11.2016 | still relevant?
    text.getBounds();

    fleetTextTextureCache[fleetSize] = app.renderer.renderer.generateTexture(text);
    window.setTimeout(function()
    {
      text.texture.destroy(true);
    }, 0);
  }

  return fleetTextTextureCache[fleetSize];
}


