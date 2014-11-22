/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>

var player1, player2, battle, battlePrep,
  reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;
var uniforms, testFilter;

module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    player1 = new Player();
    player1.color = 0xC02020;
    player1.icon = makeTempPlayerIcon(player1, 32);
    player2 = new Player();
    player2.color = 0x2020C0;
    player2.icon = makeTempPlayerIcon(player2, 32);

    function setupFleetAndPlayer(player)
    {
      for (var i = 0; i < 8; i++)
      {
        var unit = makeRandomShip();
        player.addUnit(unit);
      }
    }

    setupFleetAndPlayer(player1);
    setupFleetAndPlayer(player2);


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
