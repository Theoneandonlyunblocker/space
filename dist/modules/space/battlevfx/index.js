define("modules/space/battlevfx/drawingfunctions/beam", ["require", "exports", "pixi.js", "proton-js", "@tweenjs/tween.js", "src/Color", "src/pixiWrapperFunctions", "modules/space/battlevfx/drawingfunctions/vfxfragments/Beam", "modules/space/battlevfx/drawingfunctions/vfxfragments/LightBurst", "modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue", "modules/space/battlevfx/drawingfunctions/vfxfragments/ShockWave", "modules/space/battlevfx/drawingfunctions/shaders/ShinyParticleFilter", "modules/space/battlevfx/drawingfunctions/proton/FunctionInitialize", "modules/space/battlevfx/drawingfunctions/shaders/ShinyParticleShader", "modules/space/battlevfx/drawingfunctions/proton/PixiRenderer", "modules/space/battlevfx/drawingfunctions/proton/ProtonEmitter"], function (require, exports, PIXI, Proton, TWEEN, Color_1, pixiWrapperFunctions_1, Beam_1, LightBurst_1, RampingValue_1, ShockWave_1, ShinyParticleFilter_1, FunctionInitialize_1, ShinyParticleShader_1, PixiRenderer_1, ProtonEmitter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var relativeImpactTime = 0.18;
    function beam(props) {
        var offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(props.userOffset, props.width, "user");
        var mainContainer = new PIXI.Container();
        var impactHasOccurred = false;
        var beamOrigin = offsetUserData.singleAttackOriginPoint;
        var relativeBeamOrigin = {
            x: beamOrigin.x / props.width,
            y: beamOrigin.y / props.height,
        };
        var renderTexture = PIXI.RenderTexture.create({
            width: props.width,
            height: props.height,
        });
        var renderedSprite = new PIXI.Sprite(renderTexture);
        if (!props.facingRight) {
            renderedSprite.x = props.width;
            renderedSprite.scale.x = -1;
        }
        var finalColor = [
            0.368627450980392,
            0.792156862745098,
            0.694117647058823,
            1.0,
        ];
        var particleContainer = new PIXI.Container();
        mainContainer.addChild(particleContainer);
        var proton = new Proton();
        proton.addRenderer(new PixiRenderer_1.PixiRenderer(particleContainer));
        var particleShaderColor = {
            r: 1.0,
            g: 1.0,
            b: 1.0,
            a: 1.0,
        };
        var particleShaderColorArray = [
            particleShaderColor.r,
            particleShaderColor.g,
            particleShaderColor.b,
            particleShaderColor.a,
        ];
        var particleShaderColorTween = new TWEEN.Tween(particleShaderColor).to({
            r: finalColor[0],
            g: finalColor[1],
            b: finalColor[2],
            a: 1.0,
        }, props.duration / 2);
        var particlesAmountScale = props.width / 700;
        var beamFragment = new Beam_1.Beam({
            color: new Color_1.Color(finalColor[0], finalColor[1], finalColor[2]),
            relativeImpactTime: relativeImpactTime,
            relativeBeamOrigin: relativeBeamOrigin,
            size: {
                x: props.width,
                y: props.height,
            },
            timeScale: 100,
            noiseAmplitude: new RampingValue_1.RampingValue(0.0, 0.4, -0.4),
            lineIntensity: new RampingValue_1.RampingValue(2.0, 5.0, -5.0),
            bulgeIntensity: new RampingValue_1.RampingValue(0.0, 6.0, -6.0),
            bulgeSizeX: new RampingValue_1.RampingValue(0.0, 0.7, -0.7),
            bulgeSizeY: new RampingValue_1.RampingValue(0.0, 0.4, -0.4),
            lineYSize: new RampingValue_1.RampingValue(0.01, 0.2, -0.21),
            bulgeSharpness: new RampingValue_1.RampingValue(0.3, 0.35, -0.35),
            lineXSharpness: new RampingValue_1.RampingValue(0.99, -0.99, 0.99),
            lineYSharpness: new RampingValue_1.RampingValue(0.99, -0.15, 0.16),
        });
        beamFragment.draw();
        mainContainer.addChild(beamFragment.displayObject);
        var smallEmitter = new ProtonEmitter_1.ProtonEmitter();
        smallEmitter.p.x = beamOrigin.x + 50;
        smallEmitter.p.y = beamOrigin.y;
        smallEmitter.life = props.duration / 1000 * 0.8;
        smallEmitter.damping = 0.013;
        proton.addEmitter(smallEmitter);
        var smallParticleFilter = new ShinyParticleFilter_1.ShinyParticleFilter();
        var syncSmallParticleUniforms = function (time) {
            var lifeLeft = 1.0 - time;
            smallParticleFilter.setUniforms({
                spikeColor: particleShaderColorArray,
                spikeIntensity: Math.pow(lifeLeft, 1.5) * 0.4,
                highlightIntensity: Math.pow(lifeLeft, 1.5),
            });
        };
        var smallParticleGraphicsSize = {
            x: 4,
            y: 4,
        };
        var smallParticleGraphics = new PIXI.Graphics();
        smallParticleGraphics.beginFill(0x5ECAB1, 1.0);
        smallParticleGraphics.drawRect(smallParticleGraphicsSize.x / 2, smallParticleGraphicsSize.y / 2, smallParticleGraphicsSize.x, smallParticleGraphicsSize.y);
        smallParticleGraphics.endFill();
        var smallParticleTexture = pixiWrapperFunctions_1.generateTextureWithBounds(props.renderer, smallParticleGraphics, PIXI.settings.SCALE_MODE, 1, new PIXI.Rectangle(0, 0, smallParticleGraphicsSize.x * 1.5, smallParticleGraphicsSize.y * 1.5));
        smallEmitter.addInitialize(new FunctionInitialize_1.FunctionInitialize("createSprite", function (particle) {
            var sprite = particle.displayObject = new PIXI.Sprite(smallParticleTexture);
            sprite.filters = [smallParticleFilter];
            sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
        }));
        smallEmitter.addInitialize(new Proton.Velocity(new Proton.Span(2.5, 3.5), new Proton.Span(270, 35, true), "polar"));
        smallEmitter.addInitialize(new Proton.Position(new Proton.RectZone(0, -30, props.width + 100 - smallEmitter.p.x, 60)));
        smallEmitter.addInitialize(new Proton.Life(new Proton.Span(props.duration * (1.0 - relativeImpactTime) / 6000, props.duration * (1.0 - relativeImpactTime) / 3000)));
        smallEmitter.addBehaviour(new Proton.Scale(new Proton.Span(0.8, 1), 0, Infinity, function (value) {
            return Math.max(value, beamFragment.props.lineYSize.lastValue);
        }));
        smallEmitter.addBehaviour(new Proton.RandomDrift(20, 30, props.duration / 2000));
        var shinyEmitter = new ProtonEmitter_1.ProtonEmitter();
        shinyEmitter.p.x = beamOrigin.x;
        shinyEmitter.p.y = beamOrigin.y;
        shinyEmitter.damping = 0.009;
        shinyEmitter.life = props.duration / 1000 * 0.8;
        shinyEmitter.rate = new Proton.Rate(150 * particlesAmountScale, 0);
        proton.addEmitter(shinyEmitter);
        var shinyParticleShader = new ShinyParticleShader_1.ShinyParticleShader();
        var syncShinyParticleUniforms = function (time) {
            var lifeLeft = 1.0 - time;
            shinyParticleShader.setUniforms({
                spikeColor: particleShaderColorArray,
                spikeIntensity: 1 - time * 0.1,
                highlightIntensity: Math.pow(lifeLeft, 2.0),
            });
        };
        shinyEmitter.addInitialize(new FunctionInitialize_1.FunctionInitialize("createMesh", (function (particle) {
            var mesh = particle.displayObject = pixiWrapperFunctions_1.makeCenteredShaderSprite(shinyParticleShader);
            mesh.blendMode = PIXI.BLEND_MODES.SCREEN;
        })));
        var shinyEmitterLifeInitialize = new Proton.Life(new Proton.Span(props.duration / 3000, props.duration / 1000));
        shinyEmitter.addInitialize(shinyEmitterLifeInitialize);
        shinyEmitter.addInitialize(new Proton.Position(new Proton.RectZone(0, -5, props.width + 100 - shinyEmitter.p.x, 10)));
        shinyEmitter.addBehaviour(new Proton.Scale(new Proton.Span(60, 100), -20, Infinity, function (value) {
            return Math.max(value, beamFragment.props.lineYSize.lastValue);
        }));
        shinyEmitter.emit("once");
        var shockWaveSize = {
            x: props.width * 3.0,
            y: props.height * 3.0,
        };
        var shockWaveFragment = new ShockWave_1.ShockWave({
            size: shockWaveSize,
            intersectingEllipseOrigin: { x: 0.05, y: 0.0 },
            intersectingEllipseDrift: { x: 0.3, y: 0.0 },
            alpha: new RampingValue_1.RampingValue(1.0, -1.0, 0.0),
            mainEllipseScaleX: new RampingValue_1.RampingValue(0.0, 0.3, 0.0),
            mainEllipseScaleY: new RampingValue_1.RampingValue(0.0, 0.9, 0.0),
            mainEllipseSharpness: new RampingValue_1.RampingValue(0.95, -0.15, 0.0),
            intersectingEllipseScaleX: new RampingValue_1.RampingValue(0.0, 0.8, 0.0),
            intersectingEllipseScaleY: new RampingValue_1.RampingValue(0.0, 1.0, 0.0),
            intersectingEllipseSharpness: new RampingValue_1.RampingValue(0.8, -0.4, 0.0),
            color: new Color_1.Color(1.0, 1.0, 1.0),
            delay: relativeImpactTime,
        });
        shockWaveFragment.draw();
        shockWaveFragment.setCenter(beamOrigin.x, beamOrigin.y);
        mainContainer.addChild(shockWaveFragment.displayObject);
        var lightBurstSize = {
            x: props.height * 1.5,
            y: props.height * 3,
        };
        var lightBurstFragment = new LightBurst_1.LightBurst({
            size: lightBurstSize,
            delay: relativeImpactTime,
            sharpness: 2.0,
            color: new Color_1.Color(0.75, 0.75, 0.62),
            centerSize: 1.0,
            rayStrength: 1.0,
        });
        lightBurstFragment.draw();
        lightBurstFragment.setCenter(beamOrigin.x, beamOrigin.y);
        mainContainer.addChild(lightBurstFragment.displayObject);
        function animate() {
            var elapsedTime = Date.now() - startTime;
            proton.update();
            var tweenTime = window.performance.now();
            particleShaderColorTween.update(tweenTime);
            particleShaderColorArray[0] = particleShaderColor.r;
            particleShaderColorArray[1] = particleShaderColor.g;
            particleShaderColorArray[2] = particleShaderColor.b;
            particleShaderColorArray[3] = particleShaderColor.a;
            var relativeElapsedTime = elapsedTime / props.duration;
            var lifeLeft = 1 - relativeElapsedTime;
            if (relativeElapsedTime >= relativeImpactTime - 0.02) {
                if (!impactHasOccurred) {
                    impactHasOccurred = true;
                    var lifeLeftSecs = props.duration * lifeLeft / 1000;
                    var velocityInitialize_1 = new Proton.Velocity(new Proton.Span(1.5, 3), new Proton.Span(270, 25, true), "polar");
                    shinyEmitter.addInitialize(velocityInitialize_1);
                    shinyEmitter.particles.forEach(function (particle) {
                        velocityInitialize_1.initialize(particle);
                    });
                    shinyEmitter.removeInitialize(shinyEmitterLifeInitialize);
                    shinyEmitter.addInitialize(new Proton.Life(new Proton.Span(lifeLeftSecs / 5, lifeLeftSecs / 3)));
                    shinyEmitter.rate = new Proton.Rate(4 * particlesAmountScale, 0.52);
                    shinyEmitter.emit();
                    smallEmitter.rate = new Proton.Rate(6 * particlesAmountScale, 0.02);
                    smallEmitter.emit();
                    props.triggerEffect();
                }
                syncSmallParticleUniforms(relativeElapsedTime);
            }
            beamFragment.animate(relativeElapsedTime);
            syncShinyParticleUniforms(relativeElapsedTime);
            shockWaveFragment.animate(relativeElapsedTime);
            lightBurstFragment.animate(relativeElapsedTime);
            props.renderer.render(mainContainer, renderTexture, true);
            if (elapsedTime < props.duration) {
                requestAnimationFrame(animate);
            }
            else {
                smallParticleTexture.destroy(true);
                proton.destroy();
                props.triggerEnd();
            }
        }
        props.triggerStart(renderedSprite);
        var startTime = Date.now();
        particleShaderColorTween.start();
        animate();
    }
    exports.beam = beam;
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
define("modules/space/battlevfx/drawingfunctions/ColorMatrixFilter", ["require", "exports", "pixi.js", "src/Color"], function (require, exports, PIXI, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorMatrixFilter = (function (_super) {
        __extends(ColorMatrixFilter, _super);
        function ColorMatrixFilter() {
            return _super.call(this) || this;
        }
        ColorMatrixFilter.prototype.multiplyByMatrix = function (matrix) {
            this._loadMatrix(matrix, true);
        };
        ColorMatrixFilter.prototype.addMatrix = function (matrix) {
            if (matrix.length !== this.matrix.length) {
                throw new Error("Matrix must be 5x4");
            }
            this.matrix = this.matrix.map(function (oldValue, i) {
                return oldValue + matrix[i];
            });
        };
        ColorMatrixFilter.prototype.addColor = function (color) {
            var rgb = color.getRGB();
            var r = rgb[0];
            var g = rgb[1];
            var b = rgb[2];
            var matrix = [
                0, 0, 0, 0, r,
                0, 0, 0, 0, g,
                0, 0, 0, 0, b,
                0, 0, 0, 0, 0,
            ];
            this.addMatrix(matrix);
        };
        ColorMatrixFilter.prototype.multiplyRGB = function (amount) {
            this.multiplyByColor(new Color_1.Color(amount, amount, amount));
        };
        ColorMatrixFilter.prototype.multiplyByColor = function (color) {
            var rgb = color.getRGB();
            var r = rgb[0];
            var g = rgb[1];
            var b = rgb[2];
            var matrix = [
                r, 0, 0, 0, 0,
                0, g, 0, 0, 0,
                0, 0, b, 0, 0,
                0, 0, 0, 1, 0,
            ];
            this.multiplyByMatrix(matrix);
        };
        return ColorMatrixFilter;
    }(PIXI.filters.ColorMatrixFilter));
    exports.ColorMatrixFilter = ColorMatrixFilter;
});
define("modules/space/battlevfx/drawingfunctions/guard", ["require", "exports", "src/pixiWrapperFunctions", "src/utility", "modules/space/battlevfx/drawingfunctions/shaders/GuardShader"], function (require, exports, pixiWrapperFunctions_1, utility_1, GuardShader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function guard(props) {
        var offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(props.userOffset, props.width, "user");
        var userX2 = offsetUserData.boundingBox.x + offsetUserData.boundingBox.width;
        var maxFrontier = Math.min(userX2 + 75, props.width / 2.2);
        var baseTrailDistance = 80;
        var maxTrailDistance = maxFrontier;
        var trailDistanceGrowth = maxTrailDistance - baseTrailDistance;
        var maxBlockWidth = maxFrontier * 2;
        var guardShader = new GuardShader_1.GuardShader({
            frontier: 0,
            trailDistance: baseTrailDistance,
            seed: Math.random() * 420,
            blockSize: 90,
            blockWidth: 0,
            lineAlpha: 1.5,
            blockAlpha: 0,
        });
        var travelTime = 0.3;
        var hasTriggeredEffect = false;
        var syncUniformsFN = function (time) {
            if (time < travelTime) {
                var adjustedtime = time / travelTime;
                guardShader.setUniforms({
                    frontier: maxFrontier * adjustedtime,
                });
            }
            else {
                if (props.triggerEffect && !hasTriggeredEffect) {
                    hasTriggeredEffect = true;
                    props.triggerEffect();
                }
                var relativeTime = utility_1.getRelativeValue(time, travelTime - 0.02, 1);
                var adjustedtime = Math.pow(relativeTime, 4);
                var relativeDistance = utility_1.getRelativeValue(Math.abs(0.2 - adjustedtime), 0, 0.8);
                guardShader.setUniforms({
                    trailDistance: baseTrailDistance + trailDistanceGrowth * adjustedtime,
                    blockWidth: adjustedtime * maxBlockWidth,
                    lineAlpha: (1 - adjustedtime) * 1.5,
                    blockAlpha: 1 - relativeDistance,
                });
            }
        };
        var mesh = pixiWrapperFunctions_1.makeShaderSprite(guardShader, 0, 0, maxFrontier + 20, props.height);
        var renderTexture = PIXI.RenderTexture.create({
            width: props.width,
            height: props.height,
        });
        var sprite = new PIXI.Sprite(renderTexture);
        if (!props.facingRight) {
            sprite.x = props.width;
            sprite.scale.x = -1;
        }
        function animate() {
            var elapsedTime = Date.now() - startTime;
            var relativeTime = elapsedTime / props.duration;
            syncUniformsFN(relativeTime);
            props.renderer.render(mesh, renderTexture, true);
            if (elapsedTime < props.duration) {
                requestAnimationFrame(animate);
            }
            else {
                props.triggerEnd();
            }
        }
        props.triggerStart(sprite);
        var startTime = Date.now();
        animate();
    }
    exports.guard = guard;
});
define("modules/space/battlevfx/drawingfunctions/makeVfxFromVideo", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeVfxFromVideo(videoSrc, onStartFN, props) {
        function clearBaseTextureListeners() {
            baseTexture.removeListener("loaded", onVideoLoaded);
            baseTexture.removeListener("error", onVideoError);
        }
        function onVideoLoaded() {
            clearBaseTextureListeners();
            sprite.y = props.height - videoResource.height;
            videoResource.source.play().then(function () {
                if (onStartFN) {
                    onStartFN(sprite);
                }
                props.triggerStart(sprite);
                animate();
            });
        }
        function onVideoError() {
            clearBaseTextureListeners();
            throw new Error("Video " + videoSrc + " failed to load.");
        }
        var videoResource = new PIXI.resources.VideoResource(videoSrc, {
            autoLoad: true,
            autoPlay: true,
        });
        videoResource.autoUpdate = false;
        var baseTexture = new PIXI.BaseTexture(videoResource);
        var texture = new PIXI.Texture(baseTexture);
        var sprite = new PIXI.Sprite(texture);
        if (!props.facingRight) {
            sprite.x = props.width;
            sprite.scale.x = -1;
        }
        if (videoResource.valid) {
            onVideoLoaded();
        }
        else {
            baseTexture.on("loaded", onVideoLoaded);
            baseTexture.on("error", onVideoError);
        }
        function animate() {
            videoResource.update();
            if (!videoResource.source.paused && !videoResource.source.ended) {
                requestAnimationFrame(animate);
            }
            else {
                props.triggerEnd();
                sprite.parent.removeChild(sprite);
                sprite.destroy({ texture: true, baseTexture: true });
            }
        }
    }
    exports.makeVfxFromVideo = makeVfxFromVideo;
});
define("modules/space/battlevfx/drawingfunctions/placeholder", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function placeholder(params) {
        var container = new PIXI.Container();
        var sprite = PIXI.Sprite.from("img/placeholder.png");
        sprite.anchor.set(0.5, 0.5);
        sprite.x = params.width / 2;
        sprite.y = params.height / 2;
        container.addChild(sprite);
        var startTime = performance.now();
        var endTime = startTime + params.duration;
        function animate(currentTime) {
            if (currentTime < endTime) {
                requestAnimationFrame(animate);
            }
            else {
                params.triggerEnd();
            }
        }
        params.triggerStart(container);
        animate(startTime);
    }
    exports.placeholder = placeholder;
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
define("modules/space/battlevfx/drawingfunctions/proton/FunctionBehaviour", ["require", "exports", "proton-js"], function (require, exports, Proton) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FunctionBehaviour = (function (_super) {
        __extends(FunctionBehaviour, _super);
        function FunctionBehaviour(name, applyBehaviourFN, initializeFN) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.applyBehaviour = applyBehaviourFN;
            _this.initialize = initializeFN || _this.initialize;
            return _this;
        }
        return FunctionBehaviour;
    }(Proton.Behaviour));
    exports.FunctionBehaviour = FunctionBehaviour;
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
define("modules/space/battlevfx/drawingfunctions/proton/FunctionInitialize", ["require", "exports", "proton-js"], function (require, exports, Proton) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FunctionInitialize = (function (_super) {
        __extends(FunctionInitialize, _super);
        function FunctionInitialize(name, initializeFN, resetFN) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.initialize = initializeFN;
            _this.reset = resetFN;
            return _this;
        }
        return FunctionInitialize;
    }(Proton.Initialize));
    exports.FunctionInitialize = FunctionInitialize;
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
define("modules/space/battlevfx/drawingfunctions/proton/PixiParticle", ["require", "exports", "proton-js"], function (require, exports, Proton) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PixiParticle = (function (_super) {
        __extends(PixiParticle, _super);
        function PixiParticle() {
            return _super.call(this) || this;
        }
        return PixiParticle;
    }(Proton.Particle));
    exports.PixiParticle = PixiParticle;
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
define("modules/space/battlevfx/drawingfunctions/proton/PixiRenderer", ["require", "exports", "proton-js"], function (require, exports, Proton) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PixiRenderer = (function (_super) {
        __extends(PixiRenderer, _super);
        function PixiRenderer(container) {
            return _super.call(this, container) || this;
        }
        PixiRenderer.prototype.onProtonUpdate = function () {
        };
        PixiRenderer.prototype.onProtonUpdateAfter = function () {
        };
        PixiRenderer.prototype.onEmitterAdded = function (emitter) {
        };
        PixiRenderer.prototype.onEmitterRemoved = function (emitter) {
        };
        PixiRenderer.prototype.onParticleCreated = function (particle) {
            this.element.addChild(particle.displayObject);
        };
        PixiRenderer.prototype.onParticleUpdate = function (particle) {
            PixiRenderer.applyTransform(particle);
        };
        PixiRenderer.prototype.onParticleDead = function (particle) {
            this.element.removeChild(particle.displayObject);
        };
        PixiRenderer.applyTransform = function (particle) {
            var displayObject = particle.displayObject;
            displayObject.position.x = particle.p.x;
            displayObject.position.y = particle.p.y;
            displayObject.scale.x = particle.scale;
            displayObject.scale.y = particle.scale;
            displayObject.alpha = particle.alpha;
        };
        return PixiRenderer;
    }(Proton.CustomRenderer));
    exports.PixiRenderer = PixiRenderer;
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
define("modules/space/battlevfx/drawingfunctions/proton/ProtonEmitter", ["require", "exports", "proton-js"], function (require, exports, Proton) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProtonEmitter = (function (_super) {
        __extends(ProtonEmitter, _super);
        function ProtonEmitter() {
            return _super.call(this) || this;
        }
        ProtonEmitter.prototype.update = function (time) {
            if (this.dead) {
                return;
            }
            this.age += time;
            if (this.age >= this.life) {
                this.stop();
            }
            this.emitting(time);
            this.integrate(time);
        };
        return ProtonEmitter;
    }(Proton.Emitter));
    exports.ProtonEmitter = ProtonEmitter;
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
define("modules/space/battlevfx/drawingfunctions/proton/ProtonWithTimeScale", ["require", "exports", "proton-js"], function (require, exports, Proton) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProtonWithTimeScale = (function (_super) {
        __extends(ProtonWithTimeScale, _super);
        function ProtonWithTimeScale(timeScale) {
            if (timeScale === void 0) { timeScale = 1; }
            var _this = _super.call(this) || this;
            _this.timeScale = timeScale;
            return _this;
        }
        ProtonWithTimeScale.prototype.update = function () {
            this.dispatchEvent(Proton.PROTON_UPDATE);
            var time = window.performance.now() / 1000;
            if (!this.oldTime) {
                this.oldTime = time;
            }
            this.elapsed = (time - this.oldTime) * this.timeScale;
            this.oldTime = time;
            if (this.elapsed > 0) {
                this.emittersUpdate(this.elapsed);
            }
            this.dispatchEvent(Proton.PROTON_UPDATE_AFTER);
        };
        return ProtonWithTimeScale;
    }(Proton));
    exports.ProtonWithTimeScale = ProtonWithTimeScale;
});
define("modules/space/battlevfx/drawingfunctions/rocketAttack", ["require", "exports", "pixi.js", "modules/space/battlevfx/drawingfunctions/vfxfragments/ProjectileAttack", "modules/space/battlevfx/resources"], function (require, exports, PIXI, ProjectileAttack_1, resources_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function rocketAttack(params) {
        var offsetTargetData = params.target.drawingFunctionData.normalizeForBattleVfx(params.targetOffset, params.width, "target");
        var offsetUserData = params.user.drawingFunctionData.normalizeForBattleVfx(params.userOffset, params.width, "user");
        var container = new PIXI.Container();
        if (!params.facingRight) {
            container.x = params.width;
            container.scale.x = -1;
        }
        var startTime = Date.now();
        var impactHasOccurred = false;
        var maxSpeedAt1000Duration = params.width * params.duration / 30;
        var maxSpeed = maxSpeedAt1000Duration * (1000 / params.duration);
        var acceleration = maxSpeed / 6;
        var explosionTextures = [];
        for (var i = 0; i < 26; i++) {
            var explosionTexture = PIXI.Texture.from("Explosion_Sequence_A " + (i + 1) + ".png");
            explosionTextures.push(explosionTexture);
        }
        var explosionsById = {};
        var relativeTimePerSecond = 1000 / params.duration;
        var relativeTimePerExplosionFrame = relativeTimePerSecond / 60;
        var projectileAttackFragment = new ProjectileAttack_1.ProjectileAttack({
            makeProjectileSprite: function (i) {
                return new PIXI.Sprite(PIXI.Texture.from(resources_1.resources.rocketProjectile));
            },
            maxSpeed: maxSpeed,
            acceleration: acceleration,
            amountToSpawn: offsetUserData.sequentialAttackOriginPoints.length > 1 ?
                offsetUserData.sequentialAttackOriginPoints.length :
                8,
            spawnTimeStart: 0,
            spawnTimeEnd: 0.4,
            removeAfterImpact: true,
            impactRate: 0.8,
            onImpact: function (projectile, impactContainer, time) {
                if (!impactHasOccurred) {
                    params.triggerEffect();
                    impactHasOccurred = true;
                }
                var remainingTime = 1 - time;
                var remainingTimePerFrame = remainingTime / explosionTextures.length;
                explosionsById[projectile.id] =
                    {
                        clip: new PIXI.AnimatedSprite(explosionTextures),
                        startTime: time,
                        relativeTimePerFrame: Math.min(relativeTimePerExplosionFrame, remainingTimePerFrame),
                    };
                var explosionClip = explosionsById[projectile.id].clip;
                explosionClip.anchor.set(0.5, 0.5);
                explosionClip.loop = false;
                explosionClip.position.copyFrom(projectile.sprite.position);
                explosionClip.position.x += projectile.sprite.width;
                impactContainer.addChild(explosionClip);
            },
            animateImpact: function (projectile, impactContainer, time) {
                var explosion = explosionsById[projectile.id];
                var relativeTimePlayed = time - explosion.startTime;
                var targetFrame = Math.round(relativeTimePlayed / explosion.relativeTimePerFrame);
                if (targetFrame >= 0 &&
                    targetFrame < explosion.clip.totalFrames) {
                    explosion.clip.gotoAndStop(targetFrame);
                    explosion.clip.visible = true;
                }
                else {
                    explosion.clip.visible = false;
                }
            },
            impactPosition: {
                min: offsetTargetData.boundingBox.x,
                max: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width,
            },
        });
        projectileAttackFragment.draw(offsetUserData, offsetTargetData);
        container.addChild(projectileAttackFragment.displayObject);
        function animate() {
            var elapsedTime = Date.now() - startTime;
            var relativeTime = elapsedTime / params.duration;
            projectileAttackFragment.animate(relativeTime);
            if (elapsedTime < params.duration) {
                requestAnimationFrame(animate);
            }
            else {
                params.triggerEnd();
            }
        }
        params.triggerStart(container);
        animate();
    }
    exports.rocketAttack = rocketAttack;
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
define("modules/space/battlevfx/drawingfunctions/shaders/BeamShader", ["require", "exports", "pixi.js", "modules/space/battlevfx/drawingfunctions/shaders/vertex"], function (require, exports, PIXI, vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BeamShader = (function (_super) {
        __extends(BeamShader, _super);
        function BeamShader(initialUniformValues) {
            var _this = this;
            var program = new PIXI.Program(vertex_1.vertex, fragmentSource, "Beam");
            _this = _super.call(this, program, initialUniformValues) || this;
            return _this;
        }
        BeamShader.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return BeamShader;
    }(PIXI.Shader));
    exports.BeamShader = BeamShader;
    var fragmentSource = "/// tsBuildTargets: shader\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float time;\nuniform float seed;\nuniform float noiseAmplitude;\n\nuniform float aspectRatio;\n\nuniform vec4 beamColor;\nuniform float beamYPosition;\n\nuniform float lineIntensity;\nuniform float bulgeIntensity;\n\nuniform float bulgeXPosition;\nuniform vec2 bulgeSize;\nuniform float bulgeSharpness;\n\nuniform vec2 lineXSize;\nuniform float lineXSharpness;\n\nuniform float lineYSize;\nuniform float lineYSharpness;\n\nfloat hash(vec2 p)\n{\n  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));\n}\n\nfloat noise(vec2 x)\n{\n  vec2 i = floor(x);\n  vec2 f = fract(x);\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n}\n\nfloat ellipseGradient(vec2 p, float ellipseXPosition, vec2 ellipseSize)\n{\n  vec2 q = vec2(-1.0 + 2.0 * p.x, p.y); // (-1, -1) -> (1, 1)\n  q.x -= -1.0 + 2.0 * ellipseXPosition;\n  q.x *= aspectRatio;\n  q /= ellipseSize;\n\n  float dist = length(q);\n\n  return dist;\n}\n\nvoid main()\n{\n  vec2 uv = vTextureCoord;\n  vec4 color = texture2D(uSampler, vTextureCoord);\n\n  vec2 q = vec2(uv.x, (uv.y - beamYPosition) * 2.0);\n  float noiseValue = -1.0 + 2.0 * noise(vec2(q.x - time, seed));\n  noiseValue *= noiseAmplitude;\n\n  float yDistFromCenter = abs(q.y);\n  float insideLineY = step(yDistFromCenter, lineYSize);\n  float lineYDistanceFromEdge = distance(yDistFromCenter, lineYSize);\n  float lineYGradient = smoothstep(0.0, 1.0 - lineYSharpness, lineYDistanceFromEdge) * insideLineY;\n\n  float insideLineX = step(lineXSize.x, q.x) * step(q.x, lineXSize.y);\n  float lineXDist = 1.0 - min(distance(q.x, lineXSize.x), distance(q.x, lineXSize.y));\n  lineXDist = max(insideLineX, lineXDist);\n\n  float lineXGradient = smoothstep(lineXSharpness, 1.0, lineXDist);\n\n  float lineGradient = (lineYGradient * lineXGradient) * lineIntensity;\n  lineGradient *= 1.0 + noiseValue;\n\n  float bulgeGradient = 1.0 - ellipseGradient(q, bulgeXPosition, bulgeSize);\n  bulgeGradient = smoothstep(0.0, 1.0 - bulgeSharpness, bulgeGradient) * bulgeIntensity;\n  bulgeGradient *= 1.0 + noiseValue * 0.5;\n\n  float beamGradient = lineGradient + bulgeGradient;\n  color += beamGradient * beamColor;\n\n  gl_FragColor = color;\n}\n";
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
define("modules/space/battlevfx/drawingfunctions/shaders/BlackToAlphaFilter", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlackToAlphaFilter = (function (_super) {
        __extends(BlackToAlphaFilter, _super);
        function BlackToAlphaFilter(initialUniformValues) {
            return _super.call(this, undefined, fragmentSource, initialUniformValues) || this;
        }
        BlackToAlphaFilter.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return BlackToAlphaFilter;
    }(PIXI.Filter));
    exports.BlackToAlphaFilter = BlackToAlphaFilter;
    var fragmentSource = "/// tsBuildTargets: filter\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nvoid main()\n{\n  vec4 color = texture2D(uSampler, vTextureCoord);\n  color.a = (color.r + color.g + color.b) / 3.0;\n\n  gl_FragColor = color;\n}\n";
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
define("modules/space/battlevfx/drawingfunctions/shaders/GuardShader", ["require", "exports", "pixi.js", "modules/space/battlevfx/drawingfunctions/shaders/vertex"], function (require, exports, PIXI, vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GuardShader = (function (_super) {
        __extends(GuardShader, _super);
        function GuardShader(initialUniformValues) {
            var _this = this;
            var program = new PIXI.Program(vertex_1.vertex, fragmentSource, "Guard");
            _this = _super.call(this, program, initialUniformValues) || this;
            return _this;
        }
        GuardShader.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return GuardShader;
    }(PIXI.Shader));
    exports.GuardShader = GuardShader;
    var fragmentSource = "/// tsBuildTargets: shader\n\nprecision mediump float;\n\nuniform float frontier;\nuniform float trailDistance;\nuniform float seed;\nuniform float blockSize;\nuniform float blockWidth;\nuniform float lineAlpha;\nuniform float blockAlpha;\n\n\nfloat minX = frontier - trailDistance;\nfloat maxX = frontier + 20.0;\nfloat frontGradientStart = frontier + 17.0;\nfloat blockEnd = maxX;\n\nfloat hash(float n)\n{\n  return fract(sin(n) * 1e4);\n}\nfloat hash(vec2 p)\n{\n  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));\n}\n\nfloat noise(vec2 x)\n{\n  vec2 i = floor(x);\n  vec2 f = fract(x);\n  float a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n}\n\n\nvec4 makeLines(vec2 coord)\n{\n  float gradientAlpha = smoothstep(minX, frontier, coord.x);\n  gradientAlpha -= smoothstep(frontGradientStart, maxX, coord.x);\n  gradientAlpha += 0.5 * gradientAlpha;\n\n  float n = noise(vec2(seed, coord.y));\n  n = pow(n, 3.5);\n  float alpha = n * gradientAlpha;\n\n\n  float r = hash(vec2(seed, coord.y));\n  r = clamp(r, 0.8, 0.9) * alpha;\n  float g = (r + 0.7 - r) * alpha;\n  float b = smoothstep(0.0, 0.28, alpha);\n\n  return vec4(r, g, b, alpha);\n}\n\nvec4 makeBlocks(vec2 coord)\n{\n  vec4 lineColor = makeLines(vec2(frontier, coord.y));\n  float h = hash(vec2(seed, coord.y));\n  float blockWidth = blockWidth * (h / 2.0 + 0.5);\n\n  float blockStart = frontier - blockWidth;\n  float alpha = step(0.01, mod(smoothstep(blockStart, blockEnd, coord.x), 1.0));\n\n\n  return lineColor * alpha;\n}\n\nvoid main()\n{\n  vec4 lineColor = makeLines(gl_FragCoord.xy);\n\n  vec4 blockColor = vec4(0.0);\n\n  for (float i = 0.0; i < 10.0; i += 1.0)\n  {\n    float y = gl_FragCoord.y + hash(i) * blockSize * 20.0;\n    float blockY = floor(y / blockSize);\n    blockColor += makeBlocks(vec2(gl_FragCoord.x, blockY)) * 0.2;\n  }\n\n  gl_FragColor = lineColor * lineAlpha + blockColor * blockAlpha;\n}\n";
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
define("modules/space/battlevfx/drawingfunctions/shaders/IntersectingEllipsesShader", ["require", "exports", "pixi.js", "modules/space/battlevfx/drawingfunctions/shaders/vertex"], function (require, exports, PIXI, vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntersectingEllipsesShader = (function (_super) {
        __extends(IntersectingEllipsesShader, _super);
        function IntersectingEllipsesShader(initialUniformValues) {
            var _this = this;
            var program = new PIXI.Program(vertex_1.vertex, fragmentSource, "IntersectingEllipses");
            _this = _super.call(this, program, initialUniformValues) || this;
            return _this;
        }
        IntersectingEllipsesShader.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return IntersectingEllipsesShader;
    }(PIXI.Shader));
    exports.IntersectingEllipsesShader = IntersectingEllipsesShader;
    var fragmentSource = "/// tsBuildTargets: shader\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 mainColor;\nuniform float mainAlpha;\n\nuniform vec2 intersectingEllipseCenter;\nuniform vec2 intersectingEllipseSize;\nuniform float intersectingEllipseSharpness;\n\nuniform vec2 mainEllipseSize;\nuniform float mainEllipseSharpness;\n\n\nfloat ellipseGradient(vec2 p, vec2 ellipseCenter, vec2 ellipseSize)\n{\n  vec2 q = p - ellipseCenter;\n  q /= ellipseSize;\n\n  float dist = length(q);\n\n  return dist;\n}\n\nvoid main()\n{\n  vec2 uv = vTextureCoord;\n  vec4 color = texture2D(uSampler, vTextureCoord);\n\n  vec2 q = -1.0 + 2.0 * uv;\n\n  float mainDist = 1.0 - ellipseGradient(q, vec2(0.0, 0.0), mainEllipseSize);\n  float mainGradient = smoothstep(0.0, 1.0 - mainEllipseSharpness, mainDist);\n  color += mainColor * mainGradient;\n\n\n  float intersectingDist = ellipseGradient(q, intersectingEllipseCenter, intersectingEllipseSize);\n\n  float intersectingMask = step(intersectingEllipseSharpness, intersectingDist);\n  color *= intersectingMask;\n\n  float intersectingGradient = smoothstep(intersectingEllipseSharpness, 1.0, intersectingDist);\n  color *=  intersectingGradient;\n\n  gl_FragColor = color * mainAlpha;\n}\n";
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
define("modules/space/battlevfx/drawingfunctions/shaders/LightBurstShader", ["require", "exports", "pixi.js", "modules/space/battlevfx/drawingfunctions/shaders/vertex"], function (require, exports, PIXI, vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LightBurstShader = (function (_super) {
        __extends(LightBurstShader, _super);
        function LightBurstShader(initialUniformValues) {
            var _this = this;
            var program = new PIXI.Program(vertex_1.vertex, fragmentSource, "LightBurst");
            _this = _super.call(this, program, initialUniformValues) || this;
            return _this;
        }
        LightBurstShader.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return LightBurstShader;
    }(PIXI.Shader));
    exports.LightBurstShader = LightBurstShader;
    var fragmentSource = "/// tsBuildTargets: shader\n\nprecision mediump float;\n\n#define PI 3.14159265359\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 seed;\nuniform float rotation;\nuniform float rayStrength;\nuniform float raySharpness;\nuniform vec4 rayColor;\nuniform float centerSize;\nuniform float centerBloomStrength;\n\n//--------------------------------------------------------------------\n\n// https://www.shadertoy.com/view/4dlGW2\n// Tileable noise, for creating useful textures. By David Hoskins, Sept. 2013.\n// It can be extrapolated to other types of randomised texture.\n\n// https://www.shadertoy.com/terms says default license is CC BY-NC-SA 3.0 which should be fine\n\nfloat hash(in vec2 p, in float scale)\n{\n  // This is tiling part, adjusts with the scale...\n  p = mod(p, scale);\n  return fract(sin(dot(p, seed)) * 5151.5473453);\n}\n\nfloat noise(in vec2 p, in float scale)\n{\n  vec2 f;\n\n  p *= scale;\n\n\n  f = fract(p);   // Separate integer from fractional\n    p = floor(p);\n\n    f = f*f*(3.0-2.0*f);  // Cosine interpolation approximation\n\n    float res = mix(mix(hash(p,          scale),\n            hash(p + vec2(1.0, 0.0), scale), f.x),\n          mix(hash(p + vec2(0.0, 1.0), scale),\n            hash(p + vec2(1.0, 1.0), scale), f.x), f.y);\n    return res;\n}\n\nfloat fbm(in vec2 p)\n{\n  float f = 0.0;\n  // Change starting scale to any integer value...\n  float scale = 20.0;\n  float amp   = 0.5;\n\n  for (int i = 0; i < 5; i++)\n  {\n    f += noise(p, scale) * amp;\n    amp *= .65;\n    // Scale must be multiplied by an integer value...\n    scale *= 2.0;\n  }\n  // Clamp it just in case....\n  return min(f, 1.0);\n}\n\n//--------------------------------------------------------------------\n\nfloat ray(vec2 q, float angleAdjust)\n{\n  float angle = (atan(q.y, q.x) + PI + angleAdjust) / (2.0 * PI);\n  return fbm(vec2(angle, seed.y));\n}\n\nvoid main()\n{\n  vec2 uv = vTextureCoord;\n  vec4 color = texture2D(uSampler, vTextureCoord);\n\n  vec2 q = uv - 0.5;\n  q *= 1.8;\n\n  float dist = length(q);\n\n  float centerIntensity = pow(1.0 - dist, 8.0);\n  centerIntensity = smoothstep(1.0 - centerSize, 1.0, centerIntensity);\n\n  float rayIntensity = ray(q, rotation);\n  rayIntensity = smoothstep(0.4, 1.0, rayIntensity) * rayStrength;\n  rayIntensity -= dist;\n  rayIntensity *= max(1.0, raySharpness + 1.0 - dist);\n  rayIntensity += centerIntensity * centerBloomStrength;\n  rayIntensity = max(0.0, rayIntensity);\n  color += rayColor * rayIntensity;\n\n  gl_FragColor = color;\n}\n";
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
define("modules/space/battlevfx/drawingfunctions/shaders/ShinyParticleFilter", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShinyParticleFilter = (function (_super) {
        __extends(ShinyParticleFilter, _super);
        function ShinyParticleFilter(initialUniformValues) {
            return _super.call(this, undefined, fragmentSource, initialUniformValues) || this;
        }
        ShinyParticleFilter.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return ShinyParticleFilter;
    }(PIXI.Filter));
    exports.ShinyParticleFilter = ShinyParticleFilter;
    var fragmentSource = "/// tsBuildTargets: filter shader\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float spikeIntensity;\nuniform float highlightIntensity;\nuniform vec4 spikeColor;\n\n\nconst vec4 highlightColor = vec4(1.0, 1.0, 1.0, 1.0);\nconst vec2 center = vec2(0.5, 0.5);\nconst float angle = -0.1 * 3.141592;\n\nfloat spike(vec2 q)\n{\n  vec2 rotated;\n  rotated.x = cos(angle) * q.x - sin(angle) * q.y;\n  rotated.y = sin(angle) * q.x + cos(angle) * q.y;\n\n  float xStrength = max(0.5 - abs(rotated.x), 0.0);\n  float yStrength = max(0.5 - abs(rotated.y), 0.0);\n\n  return xStrength + yStrength;\n}\n\nvoid main()\n{\n  vec2 uv = vTextureCoord;\n  vec4 color = texture2D(uSampler, uv);\n\n  vec2 q = uv - 0.5;\n  // q *= 2.5;\n\n  float dist = length(q);\n\n  float spikeStrength = spike(q);\n  spikeStrength -= dist;\n  spikeStrength = pow(spikeStrength, 1.5);\n  spikeStrength *= spikeIntensity;\n\n  color += spikeColor * spikeStrength;\n\n\n  // center highlight\n  float highlightStrength = 1.0 - dist;\n  highlightStrength = pow(highlightStrength, 8.0);\n  highlightStrength *= highlightIntensity;\n\n  color += highlightColor * highlightStrength;\n\n\n  gl_FragColor = color;\n}\n";
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
define("modules/space/battlevfx/drawingfunctions/shaders/ShinyParticleShader", ["require", "exports", "pixi.js", "modules/space/battlevfx/drawingfunctions/shaders/vertex"], function (require, exports, PIXI, vertex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShinyParticleShader = (function (_super) {
        __extends(ShinyParticleShader, _super);
        function ShinyParticleShader(initialUniformValues) {
            var _this = this;
            var program = new PIXI.Program(vertex_1.vertex, fragmentSource, "ShinyParticle");
            _this = _super.call(this, program, initialUniformValues) || this;
            return _this;
        }
        ShinyParticleShader.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return ShinyParticleShader;
    }(PIXI.Shader));
    exports.ShinyParticleShader = ShinyParticleShader;
    var fragmentSource = "/// tsBuildTargets: filter shader\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float spikeIntensity;\nuniform float highlightIntensity;\nuniform vec4 spikeColor;\n\n\nconst vec4 highlightColor = vec4(1.0, 1.0, 1.0, 1.0);\nconst vec2 center = vec2(0.5, 0.5);\nconst float angle = -0.1 * 3.141592;\n\nfloat spike(vec2 q)\n{\n  vec2 rotated;\n  rotated.x = cos(angle) * q.x - sin(angle) * q.y;\n  rotated.y = sin(angle) * q.x + cos(angle) * q.y;\n\n  float xStrength = max(0.5 - abs(rotated.x), 0.0);\n  float yStrength = max(0.5 - abs(rotated.y), 0.0);\n\n  return xStrength + yStrength;\n}\n\nvoid main()\n{\n  vec2 uv = vTextureCoord;\n  vec4 color = texture2D(uSampler, uv);\n\n  vec2 q = uv - 0.5;\n  // q *= 2.5;\n\n  float dist = length(q);\n\n  float spikeStrength = spike(q);\n  spikeStrength -= dist;\n  spikeStrength = pow(spikeStrength, 1.5);\n  spikeStrength *= spikeIntensity;\n\n  color += spikeColor * spikeStrength;\n\n\n  // center highlight\n  float highlightStrength = 1.0 - dist;\n  highlightStrength = pow(highlightStrength, 8.0);\n  highlightStrength *= highlightIntensity;\n\n  color += highlightColor * highlightStrength;\n\n\n  gl_FragColor = color;\n}\n";
});
define("modules/space/battlevfx/drawingfunctions/shaders/vertex", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.vertex = "precision mediump float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main() {\n  vTextureCoord = aTextureCoord;\n  gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n}";
});
define("modules/space/battlevfx/drawingfunctions/snipe", ["require", "exports", "pixi.js", "proton-js", "src/Color", "src/UnitAttributes", "src/pixiWrapperFunctions", "modules/space/battlevfx/drawingfunctions/vfxfragments/FocusingBeam", "modules/space/battlevfx/drawingfunctions/vfxfragments/ProjectileAttack", "modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue", "modules/space/battlevfx/drawingfunctions/ColorMatrixFilter", "modules/space/battlevfx/resources", "modules/space/battlevfx/drawingfunctions/proton/PixiRenderer", "modules/space/battlevfx/drawingfunctions/proton/FunctionInitialize"], function (require, exports, PIXI, Proton, Color_1, UnitAttributes_1, pixiWrapperFunctions_1, FocusingBeam_1, ProjectileAttack_1, RampingValue_1, ColorMatrixFilter_1, resources_1, PixiRenderer_1, FunctionInitialize_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    var colors = (_a = {},
        _a[UnitAttributes_1.UnitAttribute.Attack] = Color_1.Color.fromHexString("FF4D77"),
        _a[UnitAttributes_1.UnitAttribute.Defence] = Color_1.Color.fromHexString("0BB1FF"),
        _a[UnitAttributes_1.UnitAttribute.Intelligence] = Color_1.Color.fromHexString("EB12FE"),
        _a[UnitAttributes_1.UnitAttribute.Speed] = Color_1.Color.fromHexString("12FE9E"),
        _a);
    for (var attribute in colors) {
        var color = colors[attribute];
        var hsv = color.getHSV();
        hsv[1] = 0.6;
        colors[attribute] = Color_1.Color.fromHSV.apply(Color_1.Color, hsv);
    }
    function snipe(type, params) {
        var mainContainer = new PIXI.Container();
        var offsetUserData = params.user.drawingFunctionData.normalizeForBattleVfx(params.userOffset, params.width, "user");
        var offsetTargetData = params.target.drawingFunctionData.normalizeForBattleVfx(params.targetOffset, params.width, "target");
        var renderTexture = PIXI.RenderTexture.create({
            width: params.width,
            height: params.height,
        });
        var renderedSprite = new PIXI.Sprite(renderTexture);
        if (!params.facingRight) {
            renderedSprite.x = params.width;
            renderedSprite.scale.x = -1;
        }
        var beamOrigin = offsetUserData.singleAttackOriginPoint;
        var relativeBeamOrigin = {
            x: beamOrigin.x / params.width,
            y: beamOrigin.y / params.height,
        };
        var focusDuration = 0.15;
        var projectileLaunchTime = 0.35;
        var impactTime = 0.5;
        var projectileFlightDuration = impactTime - projectileLaunchTime;
        var impactHasOccurred = false;
        var beamFragment = new FocusingBeam_1.FocusingBeam({
            color: colors[type].saturate(-0.1),
            size: {
                x: params.width,
                y: params.height,
            },
            focusStartTime: 0,
            focusEndTime: focusDuration,
            decayStartTime: projectileLaunchTime,
            decayEndtime: projectileLaunchTime + projectileFlightDuration / 5,
            focusTimeExponent: 0.33,
            relativeYPosition: relativeBeamOrigin.y,
            beamIntensity: new RampingValue_1.RampingValue(5.0, 20.0, -25.0),
            beamSharpness: new RampingValue_1.RampingValue(0.75, 0.24, 0.0),
            beamSize: new RampingValue_1.RampingValue(0.12, -0.115, -0.005),
        });
        beamFragment.draw();
        mainContainer.addChild(beamFragment.displayObject);
        var maxSpeedAt1000Duration = params.width * params.duration / 2;
        var maxSpeed = maxSpeedAt1000Duration * (1000 / params.duration);
        var acceleration = maxSpeed / 0.5;
        var projectileColorMatrixFilter = new ColorMatrixFilter_1.ColorMatrixFilter();
        projectileColorMatrixFilter.multiplyByColor(colors[type]);
        projectileColorMatrixFilter.multiplyRGB(3.0);
        var projectileFragment = new ProjectileAttack_1.ProjectileAttack({
            makeProjectileSprite: function (i) {
                var sprite = new PIXI.Sprite(PIXI.Texture.from(resources_1.resources.snipeProjectile));
                sprite.height = 6;
                sprite.width = 32;
                sprite.filters = [projectileColorMatrixFilter];
                return sprite;
            },
            maxSpeed: maxSpeed,
            acceleration: acceleration,
            amountToSpawn: 1,
            useSequentialAttackOriginPoints: false,
            spawnTimeStart: projectileLaunchTime,
            spawnTimeEnd: 1,
            removeAfterImpact: true,
            impactRate: 1,
            onImpact: function (projectile, container, time) {
                if (!impactHasOccurred) {
                    impactHasOccurred = true;
                    params.triggerEffect();
                    emitters.forEach(function (emitter) {
                        emitter.p.x = projectile.sprite.position.x + projectile.sprite.width;
                        emitter.p.y = projectile.sprite.position.y;
                        emitter.emit("once");
                    });
                }
            },
            animateImpact: function (projectile, container, time) {
                params.renderer.render(particleBufferSprite, particleRenderTexture, true);
                params.renderer.render(particleContainer, particleRenderTexture, false);
                params.renderer.render(particleRenderSprite, particleBufferTexture, true);
                proton.update();
            },
            impactPosition: {
                min: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2,
                max: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2,
            },
        });
        projectileFragment.draw(offsetUserData, offsetTargetData);
        mainContainer.addChild(projectileFragment.displayObject);
        var particleContainer = new PIXI.Container();
        var proton = new Proton();
        proton.addRenderer(new PixiRenderer_1.PixiRenderer(particleContainer));
        var particlesAmountScale = params.height / 600;
        var particleRenderTexture = PIXI.RenderTexture.create({
            width: params.width,
            height: params.height,
        });
        var particleRenderSprite = new PIXI.Sprite(particleRenderTexture);
        mainContainer.addChild(particleRenderSprite);
        var particleBufferTexture = PIXI.RenderTexture.create({
            width: params.width,
            height: params.height,
        });
        var particleBufferSprite = new PIXI.Sprite(particleBufferTexture);
        particleBufferSprite.alpha *= 0.9;
        var emitters = [
            {
                name: "white",
                color: 0xFFFFFF,
                amount: 275,
                size: 6,
            },
            {
                name: "colored",
                color: colors[type].getHex(),
                amount: 25,
                size: 4,
            },
        ].map(function (emitterData) {
            var emitter = new Proton.BehaviourEmitter();
            emitter.rate = new Proton.Rate(emitterData.amount * particlesAmountScale, 0.02);
            var particleTexture = (function () {
                var particleSize = emitterData.size;
                var gfx = new PIXI.Graphics();
                gfx.beginFill(emitterData.color);
                gfx.drawRect(particleSize / 2, particleSize / 2, particleSize, particleSize);
                gfx.endFill();
                return pixiWrapperFunctions_1.generateTextureWithBounds(params.renderer, gfx, PIXI.settings.SCALE_MODE, 1, new PIXI.Rectangle(0, 0, particleSize, particleSize));
            })();
            emitter.addInitialize(new FunctionInitialize_1.FunctionInitialize("createSprite", function (particle) {
                particle.displayObject = new PIXI.Sprite(particleTexture);
            }));
            emitter.addInitialize(new Proton.Velocity(new Proton.Span(0.5, 5.0), new Proton.Span(270, 20, true), "polar"));
            var emitterArea = {
                width: Math.min(params.target.drawingFunctionData.boundingBox.width / 2, 20),
                height: Math.min(params.target.drawingFunctionData.boundingBox.height / 2, 20),
            };
            emitter.addInitialize(new Proton.Position(new Proton.RectZone(-emitterArea.width / 2, -emitterArea.height / 2, emitterArea.width, emitterArea.height)));
            emitter.addInitialize(new Proton.Life(new Proton.Span(params.duration * (1.0 - impactTime) / 3000, params.duration * (1.0 - impactTime) / 1500)));
            emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.8, 1), 0));
            proton.addEmitter(emitter);
            return emitter;
        });
        function animate() {
            var elapsedTime = Date.now() - startTime;
            var relativeElapsedTime = elapsedTime / params.duration;
            beamFragment.animate(relativeElapsedTime);
            projectileFragment.animate(relativeElapsedTime);
            params.renderer.render(mainContainer, renderTexture, true);
            if (elapsedTime < params.duration) {
                requestAnimationFrame(animate);
            }
            else {
                params.triggerEnd();
            }
        }
        params.triggerStart(renderedSprite);
        var startTime = Date.now();
        animate();
    }
    exports.snipe = snipe;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/Absorb", ["require", "exports", "pixi.js", "proton-js", "src/kinematics", "src/pixiWrapperFunctions", "src/Color", "src/utility", "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses", "modules/space/battlevfx/drawingfunctions/proton/PixiRenderer", "modules/space/battlevfx/drawingfunctions/proton/ProtonEmitter", "modules/space/battlevfx/drawingfunctions/proton/FunctionInitialize", "modules/space/battlevfx/drawingfunctions/proton/FunctionBehaviour", "modules/space/battlevfx/drawingfunctions/proton/ProtonWithTimeScale"], function (require, exports, PIXI, Proton, kinematics_1, pixiWrapperFunctions_1, Color_1, utility_1, VfxFragment_1, PropInfo, PixiRenderer_1, ProtonEmitter_1, FunctionInitialize_1, FunctionBehaviour_1, ProtonWithTimeScale_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var baseDuration = 2500;
    var Absorb = (function (_super) {
        __extends(Absorb, _super);
        function Absorb(props) {
            var _this = _super.call(this) || this;
            _this.displayName = "Absorb";
            _this.key = "absorb";
            _this.propInfo = {
                getParticleDisplayObject: new PropInfo.Function(undefined),
                duration: new PropInfo.Number(baseDuration),
                onEnd: new PropInfo.Function(undefined),
                particleCount: new PropInfo.Number(150),
                baseInitialBurstVelocity: new PropInfo.Number(150),
            };
            _this.isAnimating = false;
            _this.emitters = [];
            _this.initializeProps(props);
            _this.container = new PIXI.Container();
            _this.timeScale = baseDuration / props.duration;
            _this.proton = new ProtonWithTimeScale_1.ProtonWithTimeScale(1);
            _this.proton.addRenderer(new PixiRenderer_1.PixiRenderer(_this.container));
            return _this;
        }
        Absorb.prototype.startAnimation = function () {
            this.isAnimating = true;
            this.emitters.forEach(function (emitter) { return emitter.emit("once"); });
        };
        Absorb.prototype.stopAnimation = function () {
            this.isAnimating = false;
        };
        Absorb.prototype.animate = function (time) {
            if (!this.isAnimating && time < 0.1) {
                this.startAnimation();
            }
            else if (this.isAnimating && time > 0.9) {
                this.stopAnimation();
            }
            this.proton.update();
        };
        Absorb.prototype.draw = function (userData, targetData, renderer) {
            var _this = this;
            var targets = targetData.individualUnitBoundingBoxes.length;
            var particlesPerEmitter = this.props.particleCount / targets;
            var particleKillAreaStart = userData.boundingBox.x + userData.boundingBox.width;
            var particleKillAreaEnd = userData.boundingBox.x + userData.boundingBox.width / 2;
            var initialBurstVelocity = this.props.baseInitialBurstVelocity / (1 + Math.log(targets) / 8) * this.timeScale;
            var damping = {
                x: 1 - 0.002 * this.timeScale,
                y: 1 - 0.008 * this.timeScale,
            };
            var accelerationMultiplierToCompensateForDamping = 1 + (1 - damping.x) * 50;
            var deadEmitters = 0;
            targetData.individualUnitBoundingBoxes.forEach(function (target, i) {
                var targetDisplayObject = targetData.individualUnitDisplayObjects[i];
                var imageData = pixiWrapperFunctions_1.extractImageData(targetDisplayObject, renderer.plugins.extract);
                var desiredAcceleration = Math.abs(kinematics_1.solveAcceleration({
                    initialVelocity: initialBurstVelocity,
                    duration: _this.props.duration / 1000,
                    displacement: particleKillAreaStart - (target.x + target.width),
                })) * accelerationMultiplierToCompensateForDamping;
                var emitter = new ProtonEmitter_1.ProtonEmitter();
                emitter.p.copy(target);
                emitter.damping = 0.0;
                emitter.rate = new Proton.Rate(particlesPerEmitter);
                var imageZone = new Proton.ImageZone(imageData);
                emitter.addInitialize(new Proton.Position(imageZone));
                emitter.addInitialize(new FunctionInitialize_1.FunctionInitialize("createDisplayObject", (function (particle) {
                    var color = imageZone.getColor(particle.p.x, particle.p.y);
                    particle.displayObject = _this.props.getParticleDisplayObject(particle, new Color_1.Color(color.r / 255, color.g / 255, color.b / 255));
                })));
                emitter.addInitialize(new Proton.Mass(1));
                emitter.addInitialize(new Proton.Velocity(new Proton.Span(initialBurstVelocity / 200, initialBurstVelocity / 100), new Proton.Span(0, 360), "polar"));
                emitter.addBehaviour(new Proton.Attraction(new Proton.Vector2D(userData.singleAttackOriginPoint.x, userData.singleAttackOriginPoint.y), desiredAcceleration / 100, Infinity));
                emitter.addInitialize(new FunctionInitialize_1.FunctionInitialize("killLineInitialize", (function (particle) {
                    particle.killLine = utility_1.randInt(particleKillAreaEnd, particleKillAreaStart);
                })));
                emitter.addBehaviour(new FunctionBehaviour_1.FunctionBehaviour("killBehaviour", function (particle, deltaTime, i) {
                    var v2 = particle.v.x * deltaTime / 2;
                    var x = particle.p.x + v2;
                    if (x < particle.killLine) {
                        particle.dead = true;
                        if (emitter.particles.length <= 1) {
                            deadEmitters += 1;
                            if (deadEmitters === _this.emitters.length) {
                                if (_this.props.onEnd) {
                                    _this.props.onEnd();
                                }
                            }
                        }
                    }
                }));
                var customDampingBehaviour = new FunctionBehaviour_1.FunctionBehaviour("customDampingBehaviour", function (particle, deltaTime) {
                    particle.v.x *= damping.x;
                    particle.v.y *= damping.y;
                });
                emitter.addBehaviour(customDampingBehaviour);
                _this.emitters.push(emitter);
                _this.proton.addEmitter(emitter);
            });
            this.setDisplayObject(this.container);
        };
        return Absorb;
    }(VfxFragment_1.VfxFragment));
    exports.Absorb = Absorb;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/Beam", ["require", "exports", "pixi.js", "src/Color", "src/pixiWrapperFunctions", "src/utility", "modules/space/battlevfx/drawingfunctions/shaders/BeamShader", "modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue", "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses"], function (require, exports, PIXI, Color_1, pixiWrapperFunctions_1, utility_1, BeamShader_1, RampingValue_1, VfxFragment_1, PropInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Beam = (function (_super) {
        __extends(Beam, _super);
        function Beam(props) {
            var _this = _super.call(this) || this;
            _this.displayName = "Beam";
            _this.key = "beam";
            _this.rampUpValue = 0;
            _this.rampDownValue = 0;
            _this.propInfo = {
                size: new PropInfo.Point({ x: 500, y: 500 }),
                relativeImpactTime: new PropInfo.Number(0.2),
                relativeBeamOrigin: new PropInfo.Point({ x: 0, y: 0.5 }),
                color: new PropInfo.Color(new Color_1.Color(1, 0.9, 0.9)),
                timeScale: new PropInfo.Number(100),
                noiseAmplitude: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 0.4, -0.4)),
                lineIntensity: new PropInfo.RampingValue(new RampingValue_1.RampingValue(2.0, 5.0, -5.0)),
                bulgeIntensity: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 6.0, -6.0)),
                lineYSize: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.01, 0.2, -0.21)),
                bulgeSizeX: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 0.7, -0.7)),
                bulgeSizeY: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 0.4, -0.4)),
                bulgeSharpness: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.3, 0.35, -0.35)),
                lineXSharpness: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.99, -0.99, 0.99)),
                lineYSharpness: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.99, -0.15, 0.16)),
            };
            _this.seed = Math.random() * 100;
            _this.initializeProps(props);
            return _this;
        }
        Beam.prototype.animate = function (time) {
            var rampUpValue = this.rampUpValue = Math.pow(Math.min(time / this.props.relativeImpactTime, 1.0), 7.0);
            var timeAfterImpact = Math.max(time - this.props.relativeImpactTime, 0.0);
            var relativeTimeAfterImpact = utility_1.getRelativeValue(timeAfterImpact, 0.0, 1.0 - this.props.relativeImpactTime);
            var rampDownValue = this.rampDownValue = utility_1.clamp(Math.pow(relativeTimeAfterImpact * 1.2, 12.0), 0.0, 1.0);
            this.animateFromRampValues(time, rampUpValue, rampDownValue);
        };
        Beam.prototype.animateFromRampValues = function (time, rampUpValue, rampDownValue) {
            this.beamShader.setUniforms({
                time: time * this.props.timeScale,
                noiseAmplitude: this.props.noiseAmplitude.getValue(rampUpValue, rampDownValue),
                lineIntensity: this.props.lineIntensity.getValue(rampUpValue, rampDownValue),
                bulgeIntensity: this.props.bulgeIntensity.getValue(rampUpValue, rampDownValue),
                bulgeSize: [
                    this.props.bulgeSizeX.getValue(Math.pow(rampUpValue, 1.5), rampDownValue),
                    this.props.bulgeSizeY.getValue(Math.pow(rampUpValue, 1.5), rampDownValue),
                ],
                bulgeSharpness: this.props.bulgeSharpness.getValue(rampUpValue, rampDownValue),
                lineXSize: [
                    this.props.relativeBeamOrigin.x * rampUpValue,
                    1.0,
                ],
                lineYSize: this.props.lineYSize.getValue(rampUpValue, rampDownValue),
                lineXSharpness: this.props.lineXSharpness.getValue(rampUpValue, rampDownValue),
                lineYSharpness: this.props.lineYSharpness.getValue(rampUpValue, rampDownValue),
            });
        };
        Beam.prototype.draw = function () {
            this.beamShader = new BeamShader_1.BeamShader({
                seed: this.seed,
                beamColor: this.props.color.getRGBA(1.0),
                aspectRatio: this.props.size.x / this.props.size.y,
                bulgeXPosition: this.props.relativeBeamOrigin.x + 0.1,
                beamYPosition: this.props.relativeBeamOrigin.y,
            });
            var beamSprite = pixiWrapperFunctions_1.makeShaderSprite(this.beamShader, 0, 0, this.props.size.x, this.props.size.y);
            beamSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
            this.setDisplayObject(beamSprite);
        };
        return Beam;
    }(VfxFragment_1.VfxFragment));
    exports.Beam = Beam;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/FocusingBeam", ["require", "exports", "src/Color", "src/utility", "modules/space/battlevfx/drawingfunctions/vfxfragments/Beam", "modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue", "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses"], function (require, exports, Color_1, utility_1, Beam_1, RampingValue_1, VfxFragment_1, PropInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FocusingBeam = (function (_super) {
        __extends(FocusingBeam, _super);
        function FocusingBeam(props) {
            var _this = _super.call(this) || this;
            _this.displayName = "FocusingBeam";
            _this.key = "focusingBeam";
            _this.propInfo = {
                color: new PropInfo.Color(new Color_1.Color(1.0, 1.0, 1.0)),
                size: new PropInfo.Point({ x: 500, y: 500 }),
                focusStartTime: new PropInfo.Number(0.0),
                focusEndTime: new PropInfo.Number(0.3),
                decayStartTime: new PropInfo.Number(0.8),
                decayEndtime: new PropInfo.Number(1.0),
                focusTimeExponent: new PropInfo.Number(0.75),
                relativeYPosition: new PropInfo.Number(0.5),
                beamIntensity: new PropInfo.RampingValue(new RampingValue_1.RampingValue(5.0, 20.0, -25.0)),
                beamSharpness: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.75, 0.24, 0.0)),
                beamSize: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.12, -0.115, -0.005)),
            };
            _this.initializeProps(props);
            return _this;
        }
        FocusingBeam.prototype.animate = function (time) {
            var relativeFocusTime = Math.pow(utility_1.getRelativeValue(time, this.props.focusStartTime, this.props.focusEndTime), this.props.focusTimeExponent);
            var rampUpValue = utility_1.clamp(relativeFocusTime, 0.0, 1.0);
            var relativeDecayTime = utility_1.getRelativeValue(time, this.props.decayStartTime, this.props.decayEndtime);
            var rampDownValue = utility_1.clamp(relativeDecayTime, 0.0, 1.0);
            this.beamFragment.animateFromRampValues(time, rampUpValue, rampDownValue);
        };
        FocusingBeam.prototype.draw = function () {
            this.beamFragment = new Beam_1.Beam({
                color: this.props.color,
                size: this.props.size,
                relativeImpactTime: this.props.focusStartTime,
                relativeBeamOrigin: {
                    x: 0.0,
                    y: this.props.relativeYPosition,
                },
                timeScale: 0,
                noiseAmplitude: new RampingValue_1.RampingValue(0.0),
                lineIntensity: this.props.beamIntensity,
                bulgeIntensity: new RampingValue_1.RampingValue(0.0),
                bulgeSharpness: new RampingValue_1.RampingValue(0.0),
                lineYSize: this.props.beamSize,
                bulgeSizeX: new RampingValue_1.RampingValue(0.0),
                bulgeSizeY: new RampingValue_1.RampingValue(0.0),
                lineXSharpness: new RampingValue_1.RampingValue(0.99),
                lineYSharpness: this.props.beamSharpness,
            });
            this.beamFragment.draw();
            this.setDisplayObject(this.beamFragment.displayObject);
        };
        return FocusingBeam;
    }(VfxFragment_1.VfxFragment));
    exports.FocusingBeam = FocusingBeam;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/LightBurst", ["require", "exports", "pixi.js", "src/Color", "src/pixiWrapperFunctions", "modules/space/battlevfx/drawingfunctions/shaders/LightBurstShader", "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses"], function (require, exports, PIXI, Color_1, pixiWrapperFunctions_1, LightBurstShader_1, VfxFragment_1, PropInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LightBurst = (function (_super) {
        __extends(LightBurst, _super);
        function LightBurst(props) {
            var _this = _super.call(this) || this;
            _this.displayName = "LightBurst";
            _this.key = "lightBurst";
            _this.propInfo = {
                size: new PropInfo.Point({ x: 200, y: 200 }),
                delay: new PropInfo.Number(0.3),
                sharpness: new PropInfo.Number(2.0),
                color: new PropInfo.Color(new Color_1.Color(0.75, 0.75, 0.62)),
                centerSize: new PropInfo.Number(1.0),
                rayStrength: new PropInfo.Number(1.0),
            };
            _this.seed = [Math.random() * 69, Math.random() * 420];
            _this.initializeProps(props);
            return _this;
        }
        LightBurst.prototype.animate = function (time) {
            var rampUpValue = Math.pow(Math.min(time / this.props.delay, 1.0), 7.0);
            var timeAfterImpact = Math.max(time - this.props.delay, 0.0);
            var rampDownValue = Math.pow(timeAfterImpact * 5.0, 2.0);
            var lightBurstIntensity = Math.max(rampUpValue - rampDownValue, 0.0);
            this.lightBurstShader.setUniforms({
                centerSize: Math.pow(lightBurstIntensity, 2.0) * this.props.centerSize,
                centerBloomStrength: Math.pow(lightBurstIntensity, 2.0) * 5.0,
                rayStrength: Math.pow(lightBurstIntensity, 3.0) * this.props.rayStrength,
            });
        };
        LightBurst.prototype.draw = function () {
            this.lightBurstShader = new LightBurstShader_1.LightBurstShader({
                seed: this.seed,
                rotation: 0,
                raySharpness: this.props.sharpness,
                rayColor: this.props.color.getRGBA(1.0),
            });
            var lightBurstSprite = pixiWrapperFunctions_1.makeShaderSprite(this.lightBurstShader, 0, 0, this.props.size.x, this.props.size.y);
            lightBurstSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
            this.setDisplayObject(lightBurstSprite);
        };
        return LightBurst;
    }(VfxFragment_1.VfxFragment));
    exports.LightBurst = LightBurst;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/ProjectileAttack", ["require", "exports", "pixi.js", "src/utility", "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses"], function (require, exports, PIXI, utility_1, VfxFragment_1, PropInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Projectile = (function () {
        function Projectile(props) {
            this.hasImpacted = false;
            this.id = props.id;
            this.container = props.container;
            this.sprite = props.sprite;
            this.spawnTime = props.spawnTime;
            this.maxSpeed = props.maxSpeed;
            this.acceleration = props.acceleration;
            this.spawnPositionX = props.spawnPositionX;
            this.animateProjectile = props.animateProjectile;
            this.onImpact = props.onImpact;
            this.animateImpact = props.animateImpact;
            this.impactPosition = props.impactPosition;
            this.removeAfterImpact = props.removeAfterImpact;
            this.willImpact = isFinite(this.impactPosition);
            this.container.addChild(this.sprite);
            this.sprite.visible = false;
        }
        Projectile.prototype.draw = function (time) {
            var position = this.getPosition(time);
            var tipPosition = position + this.sprite.width;
            var hasReachedImpactPosition = this.willImpact &&
                tipPosition >= this.impactPosition;
            if (hasReachedImpactPosition) {
                if (!this.hasImpacted) {
                    this.hasImpacted = true;
                    if (this.onImpact) {
                        this.onImpact(this, this.container, time);
                    }
                }
                if (this.animateImpact) {
                    this.animateImpact(this, this.container, time);
                }
            }
            var shouldDraw = time >= this.spawnTime &&
                (!this.hasImpacted || !this.removeAfterImpact);
            if (!shouldDraw) {
                this.sprite.visible = false;
            }
            else {
                this.sprite.visible = true;
                this.sprite.position.x = position;
                if (this.animateProjectile) {
                    this.animateProjectile(this, time);
                }
            }
        };
        Projectile.prototype.getPosition = function (relativeTime) {
            var time = relativeTime - this.spawnTime;
            if (time < 0) {
                return undefined;
            }
            var timeForMaxSpeed = this.spawnTime + this.maxSpeed / this.acceleration;
            var timeAccelerated = Math.min(time, timeForMaxSpeed);
            var positionBeforeMaxSpeed = this.spawnPositionX +
                0.5 * this.acceleration * Math.pow(timeAccelerated, 2.0);
            if (time <= timeForMaxSpeed) {
                return positionBeforeMaxSpeed;
            }
            else {
                var timeAfterReachingMaxSpeed = time - timeForMaxSpeed;
                return positionBeforeMaxSpeed + timeAfterReachingMaxSpeed * this.maxSpeed;
            }
        };
        return Projectile;
    }());
    var ProjectileAttack = (function (_super) {
        __extends(ProjectileAttack, _super);
        function ProjectileAttack(props) {
            var _this = _super.call(this) || this;
            _this.displayName = "ProjectileAttack";
            _this.key = "projectileAttack";
            _this.propInfo = {
                makeProjectileSprite: new PropInfo.Function(undefined),
                animateProjectile: new PropInfo.Function(undefined),
                onImpact: new PropInfo.Function(undefined),
                animateImpact: new PropInfo.Function(undefined),
                useSequentialAttackOriginPoints: new PropInfo.Boolean(true),
                removeAfterImpact: new PropInfo.Boolean(true),
                impactRate: new PropInfo.Number(0.75),
                impactPosition: new PropInfo.Range({ min: 0.7, max: 1.0 }),
                maxSpeed: new PropInfo.Number(3),
                acceleration: new PropInfo.Number(0.05),
                amountToSpawn: new PropInfo.Number(20),
                spawnTimeStart: new PropInfo.Number(0),
                spawnTimeEnd: new PropInfo.Number(500),
            };
            _this.initializeProps(props);
            _this.container = new PIXI.Container();
            return _this;
        }
        ProjectileAttack.prototype.animate = function (time) {
            this.projectiles.forEach(function (projectile) {
                projectile.draw(time);
            });
        };
        ProjectileAttack.prototype.draw = function (userData, targetData) {
            this.container.removeChildren();
            this.projectiles = [];
            var spawningDuration = this.props.spawnTimeEnd - this.props.spawnTimeStart;
            for (var i = 0; i < this.props.amountToSpawn; i++) {
                var sprite = this.props.makeProjectileSprite(i);
                var spawnPosition = this.props.useSequentialAttackOriginPoints ?
                    userData.sequentialAttackOriginPoints[i % userData.sequentialAttackOriginPoints.length] :
                    userData.singleAttackOriginPoint;
                sprite.position.y = spawnPosition.y;
                sprite.anchor.set(0, 0.5);
                this.projectiles.push(new Projectile({
                    id: i,
                    container: this.container,
                    sprite: sprite,
                    spawnTime: this.props.spawnTimeStart + i * (spawningDuration / this.props.amountToSpawn),
                    spawnPositionX: spawnPosition.x,
                    maxSpeed: this.props.maxSpeed,
                    acceleration: this.props.acceleration,
                    animateProjectile: this.props.animateProjectile,
                    onImpact: this.props.onImpact,
                    animateImpact: this.props.animateImpact,
                    impactPosition: utility_1.randInt(this.props.impactPosition.min, this.props.impactPosition.max),
                    removeAfterImpact: this.props.removeAfterImpact,
                }));
            }
            this.setDisplayObject(this.container);
        };
        return ProjectileAttack;
    }(VfxFragment_1.VfxFragment));
    exports.ProjectileAttack = ProjectileAttack;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/props/BasePropInfoClasses", ["require", "exports", "src/utility", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfo"], function (require, exports, utility_1, PropInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Primitive = (function (_super) {
        __extends(Primitive, _super);
        function Primitive() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Primitive.prototype.copyValue = function (value) {
            return value;
        };
        return Primitive;
    }(PropInfo_1.PropInfo));
    exports.Primitive = Primitive;
    var ShallowObject = (function (_super) {
        __extends(ShallowObject, _super);
        function ShallowObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShallowObject.prototype.copyValue = function (value) {
            return utility_1.shallowCopy(value);
        };
        return ShallowObject;
    }(PropInfo_1.PropInfo));
    exports.ShallowObject = ShallowObject;
    var Clonable = (function (_super) {
        __extends(Clonable, _super);
        function Clonable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Clonable.prototype.copyValue = function (value) {
            return value.clone();
        };
        return Clonable;
    }(PropInfo_1.PropInfo));
    exports.Clonable = Clonable;
});
define("modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PropInfo = (function () {
        function PropInfo(defaultValue) {
            this.defaultValue = defaultValue;
        }
        PropInfo.prototype.getDefaultValue = function () {
            return this.copyValue(this.defaultValue);
        };
        return PropInfo;
    }());
    exports.PropInfo = PropInfo;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses", ["require", "exports", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/BasePropInfoClasses", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoType"], function (require, exports, BasePropInfoClasses_1, PropInfoType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Boolean = (function (_super) {
        __extends(Boolean, _super);
        function Boolean() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.Boolean;
            return _this;
        }
        return Boolean;
    }(BasePropInfoClasses_1.Primitive));
    exports.Boolean = Boolean;
    var Number = (function (_super) {
        __extends(Number, _super);
        function Number() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.Number;
            return _this;
        }
        return Number;
    }(BasePropInfoClasses_1.Primitive));
    exports.Number = Number;
    var FunctionPropType = (function (_super) {
        __extends(FunctionPropType, _super);
        function FunctionPropType() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.Function;
            return _this;
        }
        return FunctionPropType;
    }(BasePropInfoClasses_1.Primitive));
    exports.Function = FunctionPropType;
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.Point;
            return _this;
        }
        return Point;
    }(BasePropInfoClasses_1.ShallowObject));
    exports.Point = Point;
    var Range = (function (_super) {
        __extends(Range, _super);
        function Range() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.Range;
            return _this;
        }
        return Range;
    }(BasePropInfoClasses_1.ShallowObject));
    exports.Range = Range;
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.Color;
            return _this;
        }
        return Color;
    }(BasePropInfoClasses_1.Clonable));
    exports.Color = Color;
    var RampingValue = (function (_super) {
        __extends(RampingValue, _super);
        function RampingValue() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = PropInfoType_1.PropInfoType.RampingValue;
            return _this;
        }
        return RampingValue;
    }(BasePropInfoClasses_1.Clonable));
    exports.RampingValue = RampingValue;
});
define("modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PropInfoType;
    (function (PropInfoType) {
        PropInfoType[PropInfoType["Boolean"] = 0] = "Boolean";
        PropInfoType[PropInfoType["Function"] = 1] = "Function";
        PropInfoType[PropInfoType["Number"] = 2] = "Number";
        PropInfoType[PropInfoType["Point"] = 3] = "Point";
        PropInfoType[PropInfoType["Range"] = 4] = "Range";
        PropInfoType[PropInfoType["Color"] = 5] = "Color";
        PropInfoType[PropInfoType["RampingValue"] = 6] = "RampingValue";
    })(PropInfoType = exports.PropInfoType || (exports.PropInfoType = {}));
});
define("modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RampingValue = (function () {
        function RampingValue(base, up, down) {
            if (up === void 0) { up = 0; }
            if (down === void 0) { down = 0; }
            this.base = this.lastValue = base;
            this.up = up;
            this.down = down;
        }
        RampingValue.prototype.getValue = function (up, down) {
            if (up === void 0) { up = 0; }
            if (down === void 0) { down = 0; }
            var value = this.base + this.up * up + this.down * down;
            this.lastValue = value;
            return this.lastValue;
        };
        RampingValue.prototype.clone = function () {
            return new RampingValue(this.base, this.up, this.down);
        };
        return RampingValue;
    }());
    exports.RampingValue = RampingValue;
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
define("modules/space/battlevfx/drawingfunctions/vfxfragments/ShockWave", ["require", "exports", "@tweenjs/tween.js", "src/Color", "src/pixiWrapperFunctions", "modules/space/battlevfx/drawingfunctions/shaders/IntersectingEllipsesShader", "modules/space/battlevfx/drawingfunctions/vfxfragments/RampingValue", "modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoClasses"], function (require, exports, TWEEN, Color_1, pixiWrapperFunctions_1, IntersectingEllipsesShader_1, RampingValue_1, VfxFragment_1, PropInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShockWave = (function (_super) {
        __extends(ShockWave, _super);
        function ShockWave(props) {
            var _this = _super.call(this) || this;
            _this.displayName = "ShockWave";
            _this.key = "shockWave";
            _this.propInfo = {
                size: new PropInfo.Point({ x: 200, y: 200 }),
                intersectingEllipseOrigin: new PropInfo.Point({ x: 0.0, y: 0.0 }),
                intersectingEllipseDrift: new PropInfo.Point({ x: 0.0, y: 0.0 }),
                alpha: new PropInfo.RampingValue(new RampingValue_1.RampingValue(1.0, -1.0, 0.0)),
                mainEllipseScaleX: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 1.0, 0.0)),
                mainEllipseScaleY: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 1.0, 0.0)),
                mainEllipseSharpness: new PropInfo.RampingValue(new RampingValue_1.RampingValue(1.0, -0.2, 0.0)),
                intersectingEllipseScaleX: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 1.0, 0.0)),
                intersectingEllipseScaleY: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.0, 1.0, 0.0)),
                intersectingEllipseSharpness: new PropInfo.RampingValue(new RampingValue_1.RampingValue(0.8, -0.4, 0.0)),
                color: new PropInfo.Color(new Color_1.Color(1, 1, 1)),
                delay: new PropInfo.Number(0.3),
            };
            _this.initializeProps(props);
            return _this;
        }
        ShockWave.CreateFromPartialProps = function (props) {
            return new ShockWave(props);
        };
        ShockWave.prototype.animate = function (time) {
            var p = this.props;
            var burstX = time < p.delay - 0.02 ?
                0 :
                time - (p.delay - 0.02);
            var shockWaveTime = TWEEN.Easing.Quintic.Out(burstX);
            this.shockWaveShader.setUniforms({
                mainEllipseSize: [
                    p.mainEllipseScaleX.getValue(shockWaveTime),
                    p.mainEllipseScaleY.getValue(shockWaveTime),
                ],
                intersectingEllipseSize: [
                    p.intersectingEllipseScaleX.getValue(shockWaveTime),
                    p.intersectingEllipseScaleY.getValue(shockWaveTime),
                ],
                intersectingEllipseCenter: [
                    p.intersectingEllipseOrigin.x + p.intersectingEllipseDrift.x * shockWaveTime,
                    p.intersectingEllipseOrigin.y + p.intersectingEllipseDrift.y * shockWaveTime,
                ],
                mainEllipseSharpness: p.mainEllipseSharpness.getValue(shockWaveTime),
                intersectingEllipseSharpness: p.intersectingEllipseSharpness.getValue(shockWaveTime),
                mainAlpha: p.alpha.getValue(shockWaveTime),
            });
        };
        ShockWave.prototype.draw = function () {
            var shockWaveShader = this.shockWaveShader = new IntersectingEllipsesShader_1.IntersectingEllipsesShader({
                mainColor: this.props.color.getRGBA(1.0),
            });
            var shockWaveSprite = pixiWrapperFunctions_1.makeShaderSprite(shockWaveShader, 0, 0, this.props.size.x * 1.5, this.props.size.y * 1.5);
            this.setDisplayObject(shockWaveSprite);
        };
        return ShockWave;
    }(VfxFragment_1.VfxFragment));
    exports.ShockWave = ShockWave;
});
define("modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var idGenerator = 0;
    var VfxFragment = (function () {
        function VfxFragment() {
            this.props = {};
            this.id = idGenerator++;
        }
        Object.defineProperty(VfxFragment.prototype, "displayObject", {
            get: function () {
                return this._displayObject;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VfxFragment.prototype, "bounds", {
            get: function () {
                return this.displayObject.getBounds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VfxFragment.prototype, "position", {
            get: function () {
                return this.displayObject.position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VfxFragment.prototype, "scale", {
            get: function () {
                return this.displayObject.scale;
            },
            set: function (scale) {
                this.displayObject.scale.set(scale.x, scale.y);
            },
            enumerable: true,
            configurable: true
        });
        VfxFragment.prototype.setDefaultProps = function () {
            for (var key in this.propInfo) {
                this.props[key] = this.propInfo[key].getDefaultValue();
            }
        };
        VfxFragment.prototype.setCenter = function (x, y) {
            var bounds = this.displayObject.getBounds();
            this.position.set(x - bounds.width / 2, y - bounds.height / 2);
        };
        VfxFragment.prototype.initializeProps = function (initialValues) {
            this.setDefaultProps();
            if (initialValues) {
                this.setProps(initialValues);
            }
        };
        VfxFragment.prototype.setDisplayObject = function (newDisplayObject) {
            var oldDisplayObject = this.displayObject;
            if (oldDisplayObject) {
                newDisplayObject.position.copyFrom(oldDisplayObject.position);
                var parent_1 = oldDisplayObject.parent;
                if (parent_1) {
                    var childIndex = parent_1.children.indexOf(oldDisplayObject);
                    parent_1.removeChildAt(childIndex);
                    parent_1.addChildAt(newDisplayObject, childIndex);
                }
            }
            this._displayObject = newDisplayObject;
        };
        VfxFragment.prototype.setProps = function (props) {
            for (var key in props) {
                this.props[key] = this.propInfo[key].copyValue(props[key]);
            }
        };
        return VfxFragment;
    }());
    exports.VfxFragment = VfxFragment;
});
define("modules/space/battlevfx/resources", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toLoad = {
        snipeProjectile: "./img/ellipse.png",
        rocketProjectile: "./img/rocket.png",
        rocketExplosion: "./img/explosion.json",
    };
    exports.resources = {
        snipeProjectile: "snipeProjectile",
        rocketProjectile: "rocketProjectile",
    };
});
define("modules/space/battlevfx/spaceBattleVfx", ["require", "exports", "src/GameModuleInitializationPhase", "modules/space/battlevfx/resources", "modules/space/battlevfx/templates/battleVfx", "json!modules/space/battlevfx/moduleInfo.json"], function (require, exports, GameModuleInitializationPhase_1, battleVfxResources, BattleVfxTemplates, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceBattleVfx = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.BattleStart,
        supportedLanguages: "all",
        initialize: function (baseUrl) {
            var loader = new PIXI.Loader(baseUrl);
            for (var key in battleVfxResources.toLoad) {
                loader.add(key, battleVfxResources.toLoad[key]);
            }
            return new Promise(function (resolve) {
                loader.load(resolve);
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(BattleVfxTemplates, "BattleVfx");
        }
    };
});
define("modules/space/battlevfx/templates/battleVfx", ["require", "exports", "src/UnitAttributes", "modules/space/battlevfx/drawingfunctions/shaders/BlackToAlphaFilter", "modules/space/battlevfx/drawingfunctions/beam", "modules/space/battlevfx/drawingfunctions/guard", "modules/space/battlevfx/drawingfunctions/makeVfxFromVideo", "modules/space/battlevfx/drawingfunctions/placeholder", "modules/space/battlevfx/drawingfunctions/rocketAttack", "modules/space/battlevfx/drawingfunctions/snipe"], function (require, exports, UnitAttributes_1, BlackToAlphaFilter_1, beam_1, guard_1, makeVfxFromVideo_1, placeholder_1, rocketAttack_1, snipe_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rocketAttack = {
        duration: 1500,
        battleOverlay: rocketAttack_1.rocketAttack,
        vfxWillTriggerEffect: true,
    };
    exports.guard = {
        duration: 750,
        battleOverlay: guard_1.guard,
        vfxWillTriggerEffect: true,
    };
    exports.beam = {
        duration: 3500,
        battleOverlay: beam_1.beam,
        vfxWillTriggerEffect: true,
    };
    function makeSnipeTemplate(attribute) {
        return ({
            duration: 3000,
            battleOverlay: snipe_1.snipe.bind(null, attribute),
            vfxWillTriggerEffect: true,
        });
    }
    exports.snipeAttack = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Attack);
    exports.snipeDefence = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Defence);
    exports.snipeIntelligence = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Intelligence);
    exports.snipeSpeed = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Speed);
    exports.videoTest = {
        duration: 1000,
        battleOverlay: makeVfxFromVideo_1.makeVfxFromVideo.bind(null, "img/bushiAttack.webm", function (sprite) {
            sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
            sprite.filters = [new BlackToAlphaFilter_1.BlackToAlphaFilter()];
        }),
        vfxWillTriggerEffect: false,
    };
    exports.placeholder = {
        duration: 1000,
        battleOverlay: placeholder_1.placeholder,
        vfxWillTriggerEffect: false,
    };
});
//# sourceMappingURL=index.js.map