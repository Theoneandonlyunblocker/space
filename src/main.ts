/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>
/// <reference path="loader.ts"/>

/// <reference path="shaders/uniformmanager.ts"/>

var players, player1, pirates, battle, battlePrep, game,
  reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;
var nebulaUniforms, nebulaFilter, uniformManager, seed;

module Rance
{
  seed = Math.random();
  //seed = 0.4308639666996896;
  Math.random = RNG.prototype.uniform.bind(new RNG(seed));
  export var images: any;
  export var loader = new Loader(function()
  {
    init()
  });

  function init()
  {
    Rance.images = loader.imageCache;

    players = [];

    for (var i = 0; i < 5; i++)
    {
      var player = new Player();
      player.makeFlag();

      players.push(player);
    }

    player1 = players[0];

    pirates = new Player();
    pirates.setupPirates();


    var nebulaColorScheme = generateColorScheme();

    var lightness = randRange(1, 1.2);

    nebulaUniforms =
    {
      baseColor: {type: "3fv", value: hex2rgb(nebulaColorScheme.main)},
      overlayColor: {type: "3fv", value: hex2rgb(nebulaColorScheme.secondary)},
      highlightColor: {type: "3fv", value: [1.0, 1.0, 1.0]},

      coverage: {type: "1f", value: randRange(0.2, 0.4)},

      scale: {type: "1f", value: randRange(4, 8)},

      diffusion: {type: "1f", value: randRange(2.3, 3.0)},
      streakiness: {type: "1f", value: randRange(1.5, 2.5)},

      streakLightness: {type: "1f", value: lightness},
      cloudLightness: {type: "1f", value: lightness},

      highlightA: {type: "1f", value: 0.9},
      highlightB: {type: "1f", value: 2.2},

      seed: {type: "2fv", value: [Math.random() * 100, Math.random() * 100]}
    }

    var nebulaShaderSrc =
    [
      "precision mediump float;",
      "",
      "uniform vec3 baseColor;",
      "uniform vec3 overlayColor;",
      "uniform vec3 highlightColor;",
      "",
      "uniform float coverage;",
      "",
      "uniform float scale;",
      "",
      "uniform float diffusion;",
      "uniform float streakiness;",
      "",
      "uniform float streakLightness;",
      "uniform float cloudLightness;",
      "",
      "uniform float highlightA;",
      "uniform float highlightB;",
      "",
      "uniform vec2 seed;",
      "",
      "const int sharpness = 6;",
      "/*",
      "const vec3 baseColor = vec3(1.0, 0.0, 0.0);",
      "const vec3 overlayColor = vec3(0.0, 0.0, 1.0);",
      "const vec3 highlightColor = vec3(1.0, 1.0, 1.0);",
      "",
      "const float coverage = 0.3;",
      "const float coverage2 = coverage / 2.0;",
      "",
      "const float scale = 4.0;",
      "",
      "const float diffusion = 3.0;",
      "const float streakiness = 2.0;",
      "",
      "const float streakLightness = 1.0;",
      "const float cloudLightness = 1.0;",
      "",
      "const float highlightA = 0.9;",
      "const float highlightB = 2.2;",
      "",
      "const vec2 seed = vec2(69.0, 42.0);",
      "*/",
      "",
      "float hash(vec2 p)",
      "{",
      "  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));",
      "}",
      "",
      "float noise(vec2 x)",
      "{",
      "  vec2 i = floor(x);",
      "  vec2 f = fract(x);",
      "  float a = hash(i);",
      "  float b = hash(i + vec2(1.0, 0.0));",
      "  float c = hash(i + vec2(0.0, 1.0));",
      "  float d = hash(i + vec2(1.0, 1.0));",
      "  vec2 u = f * f * (3.0 - 2.0 * f);",
      "  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;",
      "}",
      "",
      "float fbm(vec2 x)",
      "{",
      "  float v = 0.0;",
      "  float a = 0.5;",
      "  vec2 shift = vec2(100);",
      "  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));",
      "  for (int i = 0; i < sharpness; ++i)",
      "  {",
      "    v += a * noise(x);",
      "    x = rot * x * 2.0 + shift;",
      "    a *= 0.5;",
      "    }",
      "  return v;",
      "}",
      "",
      "float relativeValue(float v, float min, float max)",
      "{",
      "  return (v - min) / (max - min);",
      "}",
      "",
      "float displace(vec2 pos, out vec2 q)",
      "{",
      "  q = vec2(fbm(pos),",
      "    fbm(pos + vec2(23.3, 46.7)));",
      "  return fbm(pos + vec2(q.x * streakiness, q.y));",
      "}",
      "",
      "vec3 colorLayer(vec2 pos, vec3 color)",
      "{",
      "  float v = fbm(pos);",
      "  return mix(vec3(0.0), color, v);",
      "}",
      "",
      "vec3 nebula(vec2 pos, out float volume)",
      "{",
      "  vec2 on = vec2(0.0);",
      "",
      "  volume = displace(pos, on);",
      "  volume = relativeValue(volume, coverage, streakLightness);",
      "  volume += relativeValue(fbm(pos), coverage, cloudLightness);",
      "  volume = pow(volume, diffusion);",
      "",
      "  vec3 c = colorLayer(pos + vec2(42.0, 6.9), baseColor);",
      "  c = mix(c, overlayColor, dot(on.x, on.y));",
      "  c = mix(c, highlightColor, volume *",
      "    smoothstep(highlightA, highlightB, abs(on.x)+abs(on.y)) );",
      "",
      "",
      "  return c * volume;",
      "}",
      "",
      "float star(vec2 pos)",
      "{",
      "  float genValue = hash(gl_FragCoord.xy);",
      "",
      "  float color = 0.0;",
      "",
      "  if (genValue < 0.002)",
      "  {",
      "    float r = hash(pos + vec2(4.20, 6.9));",
      "    color = r;// * (0.1 * sin(time * (r * 5.0) + 720.0 * r) + 0.75);",
      "    return color;",
      "  }",
      "  else",
      "  {",
      "    return color;",
      "  }",
      "}",
      "",
      "void main(void)",
      "{",
      "  vec2 pos = gl_FragCoord.xy / 50.0 / scale;",
      "  pos += seed;",
      "  float volume = 0.0;",
      "  vec3 c = nebula(pos, volume);",
      "  c += vec3(star(pos));",
      "",
      "  gl_FragColor = vec4(c, 1.0);",
      "}",
    ]


    nebulaFilter = new PIXI.AbstractFilter(
      nebulaShaderSrc, nebulaUniforms)




    uniformManager = new UniformManager();

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

    game = new Game(galaxyMap, players, player1);
    reactUI.game = game;


    reactUI.currentScene = "galaxyMap";
    reactUI.render();
  };
}
