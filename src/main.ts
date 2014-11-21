/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="pathfinding.ts"/>

var fleet1, fleet2, player1, player2, battle, battlePrep,
  reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;
var uniforms, testFilter;

module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    fleet1 = [];
    fleet2 = [];
    player1 = new Player();
    player1.color = 0xC02020;
    player1.icon = makeTempPlayerIcon(player1, 32);
    player2 = new Player();
    player2.color = 0x2020C0;
    player2.icon = makeTempPlayerIcon(player2, 32);

    function setupFleetAndPlayer(fleet, player)
    {
      for (var i = 0; i < 2; i++)
      {
        var emptySlot = randInt(0, 3);
        var row = [];
        for (var j = 0; j < 4; j++)
        {
          if (j === emptySlot)
          {
            row.push(null);
          }
          else
          {
            var type = getRandomArrayItem(["fighterSquadron", "battleCruiser", "bomberSquadron"]);
            var unit = new Unit(Templates.ShipTypes[type]);
            row.push(unit);
            player.addUnit(unit);
          }
        }
        fleet.push(row);
      }
    }

    setupFleetAndPlayer(fleet1, player1);
    setupFleetAndPlayer(fleet2, player2);


    reactUI = new ReactUI(document.getElementById("react-container"));

    renderer = new Renderer();
    reactUI.renderer = renderer;

    mapGen = new MapGen();
    reactUI.mapGen = mapGen;

    galaxyMap = new GalaxyMap();
    galaxyMap.mapGen = mapGen;
    reactUI.galaxyMap = galaxyMap;

    playerControl = new PlayerControl(player1);
    reactUI.playerControl = playerControl;

    reactUI.currentScene = "galaxyMap";
    reactUI.render();
  });
}
