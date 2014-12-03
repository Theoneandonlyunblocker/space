/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>

/// <reference path="shaders/uniformmanager.ts"/>

var player1, player2, battle, battlePrep, game,
  reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;
var uniforms, testFilter, uniformManager;

module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    PIXI.dontSayHello = true;

    player1 = new Player();
    player1.color = 0xC02020;
    player1.makeFlag();
    player1.icon = makeTempPlayerIcon(player1, 32);
    player2 = new Player();
    player2.color = 0x2020C0;
    player2.makeFlag();
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

    uniforms =
    {
      bgColor: {type: "3fv", value: PIXI.hex2rgb(0x101040)},
      time: {type: "1f", value: 0.0}
    };


    var shaderSrc =
    [
      "precision mediump float;",
      "uniform vec3 bgColor;",
      "uniform float time;",

      "float density = 0.005;",
      "float rand(vec2 p)",
      "{",
      "  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));",
      "}",
      "void main(void)",
      "{",
      "  vec2 pos = floor(gl_FragCoord.xy);",
      "  float color = 0.0;",
      "  float starGenValue = rand(gl_FragCoord.xy);",
      "  ",
      "  if (starGenValue < density)",
      "  {",
      "    float r = rand(gl_FragCoord.xy + vec2(4.20, 6.9));",
      "    color = r * (0.1 * sin(time * (r * 5.0) + 720.0 * r) + 0.75);",
      "    gl_FragColor = vec4(vec3(color), 1.0);",
      "  }",
      "  else",
      "  {",
      "    gl_FragColor = vec4(bgColor, 1.0);",
      "  }",
      "}"
    ];

    testFilter = new PIXI.AbstractFilter(
      shaderSrc, uniforms);

    uniformManager = new UniformManager();
    uniformManager.registerObject("time", testFilter);

    reactUI = new ReactUI(document.getElementById("react-container"));

    reactUI.player = player1;

    renderer = new Renderer();
    reactUI.renderer = renderer;

    mapGen = new MapGen();
    reactUI.mapGen = mapGen;

    galaxyMap = new GalaxyMap();
    galaxyMap.setMapGen(mapGen);
    reactUI.galaxyMap = galaxyMap;

    playerControl = new PlayerControl(player1);
    reactUI.playerControl = playerControl;

    game = new Game([player1, player2], player1);


    reactUI.currentScene = "galaxyMap";
    reactUI.render();
  });
}
