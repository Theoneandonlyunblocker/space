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
var uniforms, testFilter;

module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    fleet1 = [];
    fleet2 = [];
    player1 = new Player();
    player1.color = 0xFF0000;
    player1.icon = makeTempPlayerIcon(player1, 32);
    player2 = new Player();
    player2.color = 0x0000FF;
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

    uniforms =
    {
      baseColor:
      {
        type: "4f",
        value: [0.0, 0.0, 1.0, 1.0]
      },
      lineColor:
      {
        type: "4f",
        value: [1.0, 0.0, 0.0, 1.0]
      },
      gapSize:
      {
        type: "2f",
        value: [1.5, 1.5]
      }
    }

    testFilter = new PIXI.AbstractFilter(
    [
      "precision mediump float;",

      "uniform sampler2D uSampler;",
      //"uniform vec4 baseColor;",
      "uniform vec2 gapSize;",

      "varying vec2 vTextureCoord;",
      "varying vec4 vColor;",

      "vec4 baseColor = vec4(1.0, 0.0, 0.0, 0.7);",
      "vec4 lineColor = vec4(0.0, 0.0, 1.0, 0.7);",
      //"vec2 gapSize = vec2(3.0, 3.0);",
      "void main( void )",
      "{",
      "  vec2 position = gl_FragCoord.xy;",
      "  position.x -= position.y;",
      "  vec2 scaled = vec2(floor(position.x), position.y);",
      "  vec2 res = mod(scaled, gapSize);",
      "  if(res.x>0.0)",
      "  {",
      "    gl_FragColor = baseColor;",
      "  }",
      "  else",
      "  {",
      "    gl_FragColor = lineColor;",
      "  }",
      "}"
    ],
    {
      gapSize: {type: "2f", value: {x: 3.0, y: 3.0}}  
    });

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
