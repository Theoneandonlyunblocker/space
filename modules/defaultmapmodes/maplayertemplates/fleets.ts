/// <reference path="../../../lib/pixi.d.ts" />

import MapRendererLayerTemplate from "../../../src/templateinterfaces/MapRendererLayerTemplate";

import app from "../../../src/App";
import {Fleet} from "../../../src/Fleet";
import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";
import eventManager from "../../../src/eventManager";


const fleetsLayerTemplate: MapRendererLayerTemplate =
{
  key: "fleets",
  displayName: "Fleets",
  interactive: true,
  isUsedForCameraBounds: false,
  destroy: function()
  {
    for (const fleetSize in fleetTextTextureCache)
    {
      fleetTextTextureCache[fleetSize].destroy(true);
      fleetTextTextureCache[fleetSize] = null;
      delete fleetTextTextureCache[fleetSize];
    }
  },
  drawingFunction: function(map: GalaxyMap, perspectivePlayer: Player)
  {
    const doc = new PIXI.Container();

    const points = perspectivePlayer ? perspectivePlayer.getVisibleStars() : map.stars;

    const mouseOverFN = function(fleet: Fleet)
    {
      eventManager.dispatchEvent("hoverStar", fleet.location);
    };
    const fleetClickFN = function(fleet: Fleet, event: PIXI.interaction.InteractionEvent)
    {
      const originalEvent = <MouseEvent> event.data.originalEvent;;
      if (originalEvent.button === 0)
      {
        eventManager.dispatchEvent("selectFleets", [fleet]);
      }
    };
    function singleFleetDrawFN(fleet: Fleet)
    {
      const fleetContainer = new PIXI.Container();

      const color = fleet.player.color.getHex();
      const fillAlpha = fleet.isStealthy ? 0.3 : 0.7;

      const textTexture = getFleetTextTexture(fleet);
      const text = new PIXI.Sprite(textTexture);

      const containerGfx = new PIXI.Graphics();
      containerGfx.lineStyle(1, 0x00000, 1);
      containerGfx.beginFill(color, fillAlpha);
      containerGfx.drawRect(0, 0, text.width+4, text.height);
      containerGfx.endFill();


      fleetContainer.addChild(containerGfx);
      fleetContainer.addChild(text);
      text.x += 2;
      text.y -= 1;

      fleetContainer.interactive = true;

      const boundFleetClickFN = fleetClickFN.bind(null, fleet);
      fleetContainer.on("click", boundFleetClickFN);
      fleetContainer.on("tap", boundFleetClickFN);
      fleetContainer.on("mouseover", mouseOverFN.bind(null, fleet));

      return fleetContainer;
    }

    for (let i = 0; i < points.length; i++)
    {
      const star = points[i];
      const fleets = star.getFleets();
      if (!fleets || fleets.length < 1)
      {
        continue;
      }

      const fleetsContainer = new PIXI.Container();
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
        const drawnFleet = singleFleetDrawFN(fleets[j]);
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

export default fleetsLayerTemplate;

const fleetTextTextureCache:
{
  [fleetSize: number]: PIXI.Texture;
} = {};
function getFleetTextTexture(fleet: Fleet)
{
  const fleetSize = fleet.units.length;

  if (!fleetTextTextureCache[fleetSize])
  {
    const text = new PIXI.Text("" + fleetSize,
    {
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 3,
    });

    // TODO PIXI4 | triggers bounds update that gets skipped if we just call generateTexture()
    // TODO 2016.11.02 | still relevant?
    text.getBounds();

    fleetTextTextureCache[fleetSize] = app.renderer.renderer.generateTexture(text);
    window.setTimeout(function()
    {
      text.texture.destroy(true);
    }, 0);
  }

  return fleetTextTextureCache[fleetSize];
}


