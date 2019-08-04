define("modules/space/backgrounds/drawNebula", ["require", "exports", "pixi.js", "rng-js", "src/colorGeneration", "src/pixiWrapperFunctions", "src/utility", "modules/space/backgrounds/NebulaShader"], function (require, exports, PIXI, RNG, colorGeneration_1, pixiWrapperFunctions_1, utility_1, NebulaShader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawNebula = function (seed, size, renderer) {
        var oldRng = Math.random;
        Math.random = RNG.prototype.uniform.bind(new RNG(seed));
        var nebulaColorScheme = colorGeneration_1.generateColorScheme();
        var shader = new NebulaShader_1.NebulaShader({
            baseColor: nebulaColorScheme.main.getRGB(),
            overlayColor: nebulaColorScheme.secondary.getRGB(),
            highlightColor: [1.0, 1.0, 1.0],
            coverage: utility_1.randRange(0.28, 0.32),
            scale: utility_1.randRange(4, 8),
            diffusion: utility_1.randRange(1.5, 3.0),
            streakiness: utility_1.randRange(1.5, 2.5),
            streakLightness: utility_1.randRange(1, 1.2),
            cloudLightness: utility_1.randRange(1, 1.2),
            highlightA: 0.9,
            highlightB: 2.2,
            starDensity: utility_1.randRange(0.0014, 0.0018),
            nebulaStarConcentration: utility_1.randRange(0.000, 0.004),
            starBrightness: 0.6,
            seed: [Math.random() * 100, Math.random() * 100],
        });
        var shaderSprite = pixiWrapperFunctions_1.makeShaderSprite(shader, 0, 0, size.width, size.height);
        var texture = pixiWrapperFunctions_1.generateTextureWithBounds(renderer, shaderSprite, PIXI.settings.SCALE_MODE, 1, size);
        var sprite = new PIXI.Sprite(texture);
        shaderSprite.destroy({ children: true });
        Math.random = oldRng;
        return ({
            displayObject: sprite,
            destroy: texture.destroy.bind(texture),
        });
    };
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/space/backgrounds/NebulaShader", ["require", "exports", "pixi.js", "modules/space/backgrounds/vertex"], function (require, exports, PIXI, vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NebulaShader = (function (_super) {
        __extends(NebulaShader, _super);
        function NebulaShader(initialUniformValues) {
            var _this = this;
            var program = new PIXI.Program(vertex_1.vertex, fragmentSource, "Nebula");
            _this = _super.call(this, program, initialUniformValues) || this;
            return _this;
        }
        NebulaShader.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return NebulaShader;
    }(PIXI.Shader));
    exports.NebulaShader = NebulaShader;
    var fragmentSource = "/// tsBuildTargets: shader\n\nprecision mediump float;\n\nuniform vec3 baseColor;\nuniform vec3 overlayColor;\nuniform vec3 highlightColor;\n\nuniform float coverage;\n\nuniform float scale;\n\nuniform float diffusion;\nuniform float streakiness;\n\nuniform float streakLightness;\nuniform float cloudLightness;\n\nuniform float highlightA;\nuniform float highlightB;\n\nuniform float starDensity;\nuniform float nebulaStarConcentration;\nuniform float starBrightness;\n\nuniform vec2 seed;\n\nconst int sharpness = 6;\n\nfloat hash(vec2 p)\n{\n  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));\n}\n\nfloat noise(vec2 x)\n{\n  vec2 i = floor(x);\n  vec2 f = fract(x);\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n}\n\nfloat fbm(vec2 x)\n{\n  float v = 0.0;\n  float a = 0.5;\n  vec2 shift = vec2(100);\n  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));\n  for (int i = 0; i < sharpness; ++i)\n  {\n    v += a * noise(x);\n    x = rot * x * 2.0 + shift;\n    a *= 0.5;\n    }\n  return v;\n}\n\nfloat relativeValue(float v, float min, float max)\n{\n  return (v - min) / (max - min);\n}\n\nfloat displace(vec2 pos, out vec2 q)\n{\n  q = vec2(fbm(pos),\n    fbm(pos + vec2(23.3, 46.7)));\n  return fbm(pos + vec2(q.x * streakiness, q.y));\n}\n\nvec3 colorLayer(vec2 pos, vec3 color)\n{\n  float v = fbm(pos);\n  return mix(vec3(0.0), color, v);\n}\n\nvec3 nebula(vec2 pos, out float volume)\n{\n  vec2 on = vec2(0.0);\n\n  volume = displace(pos, on);\n  volume = relativeValue(volume, coverage, streakLightness);\n  volume += relativeValue(fbm(pos), coverage, cloudLightness);\n  volume = pow(volume, diffusion);\n\n  vec3 c = colorLayer(pos + vec2(42.0, 6.9), baseColor);\n  c = mix(c, overlayColor, dot(on.x, on.y));\n  c = mix(c, highlightColor, volume *\n    smoothstep(highlightA, highlightB, abs(on.x)+abs(on.y)));\n\n\n  return c * volume;\n}\n\nfloat star(vec2 pos, float volume)\n{\n  float h = hash(pos);\n\n  float intensityCutoff = (1.0 - starDensity) - (volume * nebulaStarConcentration);\n  float starIntensity = smoothstep(intensityCutoff, 1.0, h);\n\n  return starIntensity * starBrightness;\n}\n\nvoid main(void)\n{\n  vec2 pos = gl_FragCoord.xy / 50.0 / scale;\n  pos += seed;\n  float volume = 0.0;\n  vec3 c = nebula(pos, volume);\n  c += vec3(star(pos, volume));\n\n  gl_FragColor = vec4(c, 1.0);\n}\n";
});
define("modules/space/backgrounds/spaceBackgrounds", ["require", "exports", "src/GameModuleInitializationPhase", "modules/space/backgrounds/drawNebula", "json!modules/space/backgrounds/moduleInfo.json"], function (require, exports, GameModuleInitializationPhase_1, drawNebula_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceBackgrounds = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart,
        supportedLanguages: "all",
        addToModuleData: function (moduleData) {
            if (!moduleData.mapBackgroundDrawingFunction) {
                moduleData.mapBackgroundDrawingFunction = drawNebula_1.drawNebula;
            }
            if (!moduleData.starBackgroundDrawingFunction) {
                moduleData.starBackgroundDrawingFunction = drawNebula_1.drawNebula;
            }
            return moduleData;
        },
    };
});
define("modules/space/backgrounds/vertex", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.vertex = "precision mediump float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main() {\n  vTextureCoord = aTextureCoord;\n  gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n}";
});
//# sourceMappingURL=index.js.map