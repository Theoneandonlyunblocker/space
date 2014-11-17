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
/// <reference path="renderer.ts"/>

var fleet1, fleet2, player1, player2, battle, battlePrep,
  reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;

module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    fleet1 = [];
    fleet2 = [];
    player1 = new Player();
    player1.color = 0xFF0000;
    player2 = new Player();
    player2.color = 0x0000FF;

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

    battlePrep = new BattlePrep(player1);


    reactUI = new ReactUI(document.getElementById("react-container"));
    reactUI.battlePrep = battlePrep;

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
