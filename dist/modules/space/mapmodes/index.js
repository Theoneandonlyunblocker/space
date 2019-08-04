define("modules/space/mapmodes/allMapLayerTemplates", ["require", "exports", "modules/space/mapmodes/maplayertemplates/nonFillerStars", "modules/space/mapmodes/maplayertemplates/starLinks", "modules/space/mapmodes/maplayertemplates/fleets", "modules/space/mapmodes/maplayertemplates/nonFillerVoronoiLines", "modules/space/mapmodes/maplayertemplates/resources", "modules/space/mapmodes/maplayertemplates/starOwners", "modules/space/mapmodes/maplayertemplates/fogOfWar", "modules/space/mapmodes/maplayertemplates/ownerBorders", "modules/space/mapmodes/maplayertemplates/starIncome", "modules/space/mapmodes/maplayertemplates/terrain"], function (require, exports, nonFillerStars_1, starLinks_1, fleets_1, nonFillerVoronoiLines_1, resources_1, starOwners_1, fogOfWar_1, ownerBorders_1, starIncome_1, terrain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nonFillerStars = nonFillerStars_1.nonFillerStars;
    exports.starLinks = starLinks_1.starLinks;
    exports.fleets = fleets_1.fleets;
    exports.nonFillerVoronoiLines = nonFillerVoronoiLines_1.nonFillerVoronoiLines;
    exports.resources = resources_1.resources;
    exports.starOwners = starOwners_1.starOwners;
    exports.fogOfWar = fogOfWar_1.fogOfWar;
    exports.ownerBorders = ownerBorders_1.ownerBorders;
    exports.starIncome = starIncome_1.starIncome;
    exports.terrain = terrain_1.terrain;
});
define("modules/space/mapmodes/mapLayerTemplates", ["require", "exports", "modules/space/mapmodes/allMapLayerTemplates"], function (require, exports, MapLayers) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapLayerTemplates = (_a = {},
        _a[MapLayers.nonFillerStars.key] = MapLayers.nonFillerStars,
        _a[MapLayers.starLinks.key] = MapLayers.starLinks,
        _a[MapLayers.fleets.key] = MapLayers.fleets,
        _a[MapLayers.nonFillerVoronoiLines.key] = MapLayers.nonFillerVoronoiLines,
        _a[MapLayers.resources.key] = MapLayers.resources,
        _a[MapLayers.starOwners.key] = MapLayers.starOwners,
        _a[MapLayers.fogOfWar.key] = MapLayers.fogOfWar,
        _a[MapLayers.ownerBorders.key] = MapLayers.ownerBorders,
        _a[MapLayers.starIncome.key] = MapLayers.starIncome,
        _a[MapLayers.terrain.key] = MapLayers.terrain,
        _a);
});
define("modules/space/mapmodes/maplayertemplates/fleets", ["require", "exports", "pixi.js", "src/App", "src/eventManager"], function (require, exports, PIXI, App_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fleets = {
        key: "fleets",
        displayName: "Fleets",
        interactive: true,
        isUsedForCameraBounds: false,
        destroy: function () {
            for (var fleetSize in fleetTextTextureCache) {
                fleetTextTextureCache[fleetSize].destroy(true);
                fleetTextTextureCache[fleetSize] = null;
                delete fleetTextTextureCache[fleetSize];
            }
        },
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var points = perspectivePlayer ? perspectivePlayer.getVisibleStars() : map.stars;
            var mouseOverFN = function (fleet) {
                eventManager_1.eventManager.dispatchEvent("hoverStar", fleet.location);
            };
            var fleetClickFN = function (fleet, event) {
                var originalEvent = event.data.originalEvent;
                if (originalEvent.button === 0) {
                    eventManager_1.eventManager.dispatchEvent("selectFleets", [fleet]);
                }
            };
            function singleFleetDrawFN(fleet) {
                var fleetContainer = new PIXI.Container();
                var color = fleet.player.color.getHex();
                var fillAlpha = fleet.isStealthy ? 0.3 : 0.7;
                var textTexture = getFleetTextTexture(fleet);
                var text = new PIXI.Sprite(textTexture);
                var containerGfx = new PIXI.Graphics();
                containerGfx.lineStyle(1, 0x00000, 1);
                containerGfx.beginFill(color, fillAlpha);
                containerGfx.drawRect(0, 0, text.width + 4, text.height);
                containerGfx.endFill();
                fleetContainer.addChild(containerGfx);
                fleetContainer.addChild(text);
                text.x += 2;
                text.y -= 1;
                fleetContainer.interactive = true;
                var boundFleetClickFN = fleetClickFN.bind(null, fleet);
                fleetContainer.on("click", boundFleetClickFN);
                fleetContainer.on("tap", boundFleetClickFN);
                fleetContainer.on("mouseover", mouseOverFN.bind(null, fleet));
                return fleetContainer;
            }
            for (var i = 0; i < points.length; i++) {
                var star = points[i];
                var fleets_1 = star.getFleets();
                if (!fleets_1 || fleets_1.length < 1) {
                    continue;
                }
                var fleetsContainer = new PIXI.Container();
                fleetsContainer.x = star.x;
                fleetsContainer.y = star.y - 40;
                for (var j = 0; j < fleets_1.length; j++) {
                    if (fleets_1[j].units.length === 0) {
                        continue;
                    }
                    if (fleets_1[j].isStealthy && perspectivePlayer && !perspectivePlayer.starIsDetected(fleets_1[j].location)) {
                        continue;
                    }
                    var drawnFleet = singleFleetDrawFN(fleets_1[j]);
                    drawnFleet.position.x = fleetsContainer.width;
                    fleetsContainer.addChild(drawnFleet);
                }
                if (fleetsContainer.children.length > 0) {
                    fleetsContainer.x -= fleetsContainer.width / 2;
                    doc.addChild(fleetsContainer);
                }
            }
            return doc;
        },
    };
    var fleetTextTextureCache = {};
    function getFleetTextTexture(fleet) {
        var fleetSize = fleet.units.length;
        if (!fleetTextTextureCache[fleetSize]) {
            var text_1 = new PIXI.Text("" + fleetSize, {
                fill: "#FFFFFF",
                stroke: "#000000",
                strokeThickness: 3,
            });
            fleetTextTextureCache[fleetSize] = App_1.app.renderer.renderer.generateTexture(text_1, PIXI.settings.SCALE_MODE, 1);
            window.setTimeout(function () {
                text_1.texture.destroy(true);
            }, 0);
        }
        return fleetTextTextureCache[fleetSize];
    }
});
define("modules/space/mapmodes/maplayertemplates/fogOfWar", ["require", "exports", "pixi.js", "src/App", "src/pixiWrapperFunctions", "modules/space/mapmodes/resources"], function (require, exports, PIXI, App_1, pixiWrapperFunctions_1, resources_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fogOfWarSpriteByStarId = {};
    exports.fogOfWar = {
        key: "fogOfWar",
        displayName: "Fog of war",
        interactive: false,
        isUsedForCameraBounds: false,
        initialAlpha: 0.35,
        destroy: function () {
            for (var starId in fogOfWarSpriteByStarId) {
                fogOfWarSpriteByStarId[starId].renderable = false;
                fogOfWarSpriteByStarId[starId].texture.destroy(true);
                delete fogOfWarSpriteByStarId[starId];
            }
        },
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            if (perspectivePlayer) {
                var starsInFogOfWar = perspectivePlayer.getRevealedButNotVisibleStars();
                for (var i = 0; i < starsInFogOfWar.length; i++) {
                    var star = starsInFogOfWar[i];
                    var sprite = getFogOfWarSpriteForStar(star, map.width, map.height);
                    doc.addChild(sprite);
                }
            }
            return doc;
        },
    };
    var fogOfWarTilingSprite;
    function getfogOfWarTilingSprite(width, height) {
        if (!fogOfWarTilingSprite) {
            var fowTexture = resources_1.resources.fogOfWarTexture;
            fogOfWarTilingSprite = new PIXI.TilingSprite(fowTexture, width, height);
        }
        return fogOfWarTilingSprite;
    }
    function getFogOfWarSpriteForStar(star, width, height) {
        var tiled = getfogOfWarTilingSprite(width, height);
        if (!fogOfWarSpriteByStarId[star.id] || Object.keys(fogOfWarSpriteByStarId).length < 4) {
            var poly = pixiWrapperFunctions_1.makePolygonFromPoints(star.voronoiCell.vertices);
            var gfx = new PIXI.Graphics();
            gfx.beginFill(0);
            gfx.drawShape(poly);
            gfx.endFill();
            tiled.removeChildren();
            tiled.mask = gfx;
            tiled.addChild(gfx);
            var bounds = tiled.getBounds();
            var rendered = pixiWrapperFunctions_1.generateTextureWithBounds(App_1.app.renderer.renderer, tiled, PIXI.settings.SCALE_MODE, 1, bounds);
            var sprite = new PIXI.Sprite(rendered);
            fogOfWarSpriteByStarId[star.id] = sprite;
            tiled.mask = null;
        }
        return fogOfWarSpriteByStarId[star.id];
    }
});
define("modules/space/mapmodes/maplayertemplates/nonFillerStars", ["require", "exports", "pixi.js", "src/eventManager", "src/pixiWrapperFunctions"], function (require, exports, PIXI, eventManager_1, pixiWrapperFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nonFillerStars = {
        key: "nonFillerStars",
        displayName: "Stars",
        interactive: true,
        isUsedForCameraBounds: false,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
            var onClickFN = function (star) {
                eventManager_1.eventManager.dispatchEvent("starClick", star);
            };
            var mouseOverFN = function (star) {
                eventManager_1.eventManager.dispatchEvent("hoverStar", star);
            };
            var mouseOutFN = function (event) {
                eventManager_1.eventManager.dispatchEvent("clearHover");
            };
            var _loop_1 = function (i) {
                var star = points[i];
                var territoryBuildingsCount = star.territoryBuildings.length;
                var starSize = 1 + territoryBuildingsCount * 2;
                var gfx = new PIXI.Graphics();
                if (!star.owner.isIndependent) {
                    gfx.lineStyle(starSize / 2, star.owner.color.getHex(), 1);
                }
                gfx.beginFill(0xFFFFF0);
                gfx.drawCircle(star.x, star.y, starSize);
                gfx.endFill();
                gfx.interactive = true;
                gfx.hitArea = pixiWrapperFunctions_1.makePolygonFromPoints(star.voronoiCell.vertices);
                var gfxClickFN = function (event) {
                    var originalEvent = event.data.originalEvent;
                    if (originalEvent.button) {
                        return;
                    }
                    onClickFN(star);
                };
                gfx.on("click", gfxClickFN);
                gfx.on("mouseover", mouseOverFN.bind(gfx, star));
                gfx.on("mouseout", mouseOutFN);
                gfx.on("tap", gfxClickFN);
                doc.addChild(gfx);
            };
            for (var i = 0; i < points.length; i++) {
                _loop_1(i);
            }
            doc.interactive = true;
            doc.on("touchmove", function (event) {
                var local = event.data.getLocalPosition(doc);
                var starAtLocal = map.voronoi.getStarAtPoint(local);
                if (starAtLocal) {
                    eventManager_1.eventManager.dispatchEvent("hoverStar", starAtLocal);
                }
            });
            return doc;
        },
    };
});
define("modules/space/mapmodes/maplayertemplates/nonFillerVoronoiLines", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nonFillerVoronoiLines = {
        key: "nonFillerVoronoiLines",
        displayName: "Star borders",
        interactive: false,
        isUsedForCameraBounds: true,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var gfx = new PIXI.Graphics();
            doc.addChild(gfx);
            gfx.lineStyle(1, 0xA0A0A0, 0.5);
            var visible = perspectivePlayer ? perspectivePlayer.getRevealedStars() : null;
            var lines = map.voronoi.getNonFillerVoronoiLines(visible);
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                gfx.moveTo(line.va.x, line.va.y);
                gfx.lineTo(line.vb.x, line.vb.y);
            }
            return doc;
        },
    };
});
define("modules/space/mapmodes/maplayertemplates/ownerBorders", ["require", "exports", "pixi.js", "src/borderPolygon", "src/pixiWrapperFunctions"], function (require, exports, PIXI, borderPolygon_1, pixiWrapperFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ownerBorders = {
        key: "ownerBorders",
        displayName: "Owner borders",
        interactive: false,
        isUsedForCameraBounds: true,
        initialAlpha: 0.7,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            if (borderPolygon_1.borderWidth <= 0) {
                return doc;
            }
            var revealedStars = perspectivePlayer.getRevealedStars();
            var borderEdges = borderPolygon_1.getRevealedBorderEdges(revealedStars, map.voronoi);
            for (var i = 0; i < borderEdges.length; i++) {
                var gfx = new PIXI.Graphics();
                doc.addChild(gfx);
                var polyLineData = borderEdges[i];
                var player = polyLineData.points[0].star.owner;
                gfx.lineStyle(borderPolygon_1.borderWidth, player.secondaryColor.getHex(), 1);
                if (polyLineData.isClosed) {
                    polyLineData.points.push(polyLineData.points[0]);
                }
                var polygon = pixiWrapperFunctions_1.makePolygonFromPoints(polyLineData.points);
                polygon.closeStroke = polyLineData.isClosed;
                gfx.drawShape(polygon);
            }
            return doc;
        },
    };
});
define("modules/space/mapmodes/maplayertemplates/resources", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resources = {
        key: "resources",
        displayName: "Resources",
        interactive: false,
        isUsedForCameraBounds: false,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
            for (var i = 0; i < points.length; i++) {
                var star = points[i];
                if (!star.resource) {
                    continue;
                }
                var text = new PIXI.Text(star.resource.displayName, {
                    fill: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                });
                text.x = star.x;
                text.x -= text.width / 2;
                text.y = star.y + 8;
                doc.addChild(text);
            }
            return doc;
        },
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
define("modules/space/mapmodes/maplayertemplates/shaders/OccupationFilter", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OccupationFilter = (function (_super) {
        __extends(OccupationFilter, _super);
        function OccupationFilter(initialUniformValues) {
            return _super.call(this, undefined, fragmentSource, initialUniformValues) || this;
        }
        OccupationFilter.prototype.setUniforms = function (uniforms) {
            for (var key in uniforms) {
                this.uniforms[key] = uniforms[key];
            }
        };
        return OccupationFilter;
    }(PIXI.Filter));
    exports.OccupationFilter = OccupationFilter;
    var fragmentSource = "/// tsBuildTargets: filter\n\nprecision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 offset;\nuniform float scale;\nuniform float angle;\nuniform vec4 stripeColor;\nuniform float stripeSize;\n\nvoid main()\n{\n  vec4 color = texture2D(uSampler, vTextureCoord);\n\n  vec2 pos = gl_FragCoord.xy + offset;\n\n  vec2 q;\n  q.x = cos(angle) * pos.x - sin(angle) * pos.y;\n  q.y = sin(angle) * pos.x + cos(angle) * pos.y;\n\n  q /= scale;\n\n  float stripeIntensity = sin(q.x) / 2.0 + 0.5;\n  stripeIntensity = step(stripeIntensity, stripeSize);\n\n  gl_FragColor = mix(color, stripeColor * color.a, stripeIntensity);\n}\n";
});
define("modules/space/mapmodes/maplayertemplates/shaders/vertex", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.vertex = "precision mediump float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main() {\n  vTextureCoord = aTextureCoord;\n  gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n}";
});
define("modules/space/mapmodes/maplayertemplates/starIncome", ["require", "exports", "pixi.js", "src/Color", "src/pixiWrapperFunctions", "src/utility"], function (require, exports, PIXI, Color_1, pixiWrapperFunctions_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.starIncome = {
        key: "starIncome",
        displayName: "Income",
        interactive: false,
        isUsedForCameraBounds: true,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
            var incomeBounds = map.getIncomeBounds();
            function getRelativeValueWithSteps(min, max, value, steps) {
                var difference = Math.max(max - min, 1);
                var threshhold = Math.max(difference / steps, 1);
                var relative = (Math.round(value / threshhold) * threshhold - min) / (difference);
                return relative;
            }
            var colorIndexes = {};
            function getColorForRelativeValue(min, max, relativeValue) {
                var value = utility_1.clamp(relativeValue, 0, 1);
                if (!colorIndexes[value]) {
                    var deviation = Math.abs(0.5 - value) * 2;
                    var hue = 110 * value;
                    var saturation = 0.5 + 0.2 * deviation;
                    var lightness = 0.6 + 0.25 * deviation;
                    colorIndexes[value] = Color_1.Color.fromHSL(hue / 360, saturation, lightness / 2).getHex();
                }
                return colorIndexes[value];
            }
            for (var i = 0; i < points.length; i++) {
                var star = points[i];
                var income = star.getIncome();
                var relativeIncome = getRelativeValueWithSteps(incomeBounds.min, incomeBounds.max, income, 10);
                var color = getColorForRelativeValue(incomeBounds.min, incomeBounds.max, relativeIncome);
                var poly = pixiWrapperFunctions_1.makePolygonFromPoints(star.voronoiCell.vertices);
                var gfx = new PIXI.Graphics();
                gfx.beginFill(color, 0.6);
                gfx.drawShape(poly);
                gfx.endFill();
                doc.addChild(gfx);
            }
            return doc;
        },
    };
});
define("modules/space/mapmodes/maplayertemplates/starLinks", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.starLinks = {
        key: "starLinks",
        displayName: "Links",
        interactive: false,
        isUsedForCameraBounds: false,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var gfx = new PIXI.Graphics();
            doc.addChild(gfx);
            gfx.lineStyle(1, 0xCCCCCC, 0.6);
            var points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
            var starsFullyConnected = {};
            for (var i = 0; i < points.length; i++) {
                var star = points[i];
                if (starsFullyConnected[star.id]) {
                    continue;
                }
                starsFullyConnected[star.id] = true;
                for (var j = 0; j < star.linksTo.length; j++) {
                    gfx.moveTo(star.x, star.y);
                    gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
                }
                for (var j = 0; j < star.linksFrom.length; j++) {
                    gfx.moveTo(star.linksFrom[j].x, star.linksFrom[j].y);
                    gfx.lineTo(star.x, star.y);
                }
            }
            return doc;
        },
    };
});
define("modules/space/mapmodes/maplayertemplates/starOwners", ["require", "exports", "pixi.js", "src/eventManager", "src/pixiWrapperFunctions", "modules/space/mapmodes/maplayertemplates/shaders/OccupationFilter"], function (require, exports, PIXI, eventManager_1, pixiWrapperFunctions_1, OccupationFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.starOwners = {
        key: "starOwners",
        displayName: "Star owners",
        interactive: false,
        isUsedForCameraBounds: true,
        initialAlpha: 0.5,
        destroy: function () {
            for (var key in occupationFilters) {
                delete occupationFilters[key];
            }
        },
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
            for (var i = 0; i < points.length; i++) {
                var star = points[i];
                var occupier = star.getSecondaryController();
                if (!star.owner || (!occupier && star.owner.colorAlpha === 0)) {
                    continue;
                }
                var poly = pixiWrapperFunctions_1.makePolygonFromPoints(star.voronoiCell.vertices);
                var gfx = new PIXI.Graphics();
                var alpha = 1;
                if (isFinite(star.owner.colorAlpha)) {
                    alpha *= star.owner.colorAlpha;
                }
                gfx.beginFill(star.owner.color.getHex(), alpha);
                gfx.drawShape(poly);
                gfx.endFill();
                if (occupier) {
                    var container = new PIXI.Container();
                    doc.addChild(container);
                    var mask = new PIXI.Graphics();
                    mask.beginFill(0);
                    mask.drawShape(poly);
                    mask.endFill();
                    container.addChild(gfx);
                    container.addChild(mask);
                    container.mask = mask;
                    gfx.filters = [getOccupationFilter(star.owner, occupier)];
                }
                doc.addChild(gfx);
            }
            return doc;
        },
    };
    var occupationFilters = {};
    var hasAddedEventListeners = false;
    function getOccupationFilter(owner, occupier) {
        if (!hasAddedEventListeners) {
            eventManager_1.eventManager.addEventListener("cameraZoomed", updateFilterZoom);
            eventManager_1.eventManager.addEventListener("cameraMoved", updateFilterOffset);
        }
        if (!occupationFilters[owner.id]) {
            occupationFilters[owner.id] = {};
        }
        if (!occupationFilters[owner.id][occupier.id]) {
            occupationFilters[owner.id][occupier.id] = new OccupationFilter_1.OccupationFilter({
                stripeColor: occupier.color.getRGBA(1.0),
                stripeSize: 0.33,
                offset: [0.0, 0.0],
                angle: 0.25 * Math.PI,
                scale: 8.0,
            });
        }
        return occupationFilters[owner.id][occupier.id];
    }
    function forEachOccupationFilter(cb) {
        for (var ownerId in occupationFilters) {
            for (var occupierId in occupationFilters[ownerId]) {
                cb(occupationFilters[ownerId][occupierId]);
            }
        }
    }
    function updateFilterOffset(x, y) {
        forEachOccupationFilter(function (filter) {
            filter.uniforms.offset = [-x, y];
        });
    }
    function updateFilterZoom(zoom) {
        forEachOccupationFilter(function (filter) {
            filter.uniforms.scale = zoom * 8.0;
        });
    }
});
define("modules/space/mapmodes/maplayertemplates/terrain", ["require", "exports", "polygon-offset", "pixi.js", "modules/space/terrains/terrains", "modules/space/mapgen/common/triangulate", "src/utility"], function (require, exports, Offset, PIXI, Terrains, triangulate_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function generatePointsInPolygon(polygon, density, margin) {
        var points = [];
        var offset = new Offset();
        offset.arcSegments(0);
        var offsetPolygon = offset.data(polygon).padding(margin);
        var triangles = triangulate_1.triangulate(offsetPolygon);
        var trianglesWeightedByArea = triangles.map(function (triangle) {
            return ({
                triangle: triangle,
                weight: triangle.getArea(),
            });
        });
        var totalArea = trianglesWeightedByArea.reduce(function (total, current) {
            return total + current.weight;
        }, 0);
        var amountOfPointsToGenerate = totalArea * density;
        for (var i = 0; i < amountOfPointsToGenerate; i++) {
            var triangle = utility_1.getRandomArrayItemWithWeights(trianglesWeightedByArea).triangle;
            points.push(triangle.getRandomPoint());
        }
        return points;
    }
    exports.terrain = {
        key: "terrain",
        displayName: "Terrain",
        interactive: false,
        isUsedForCameraBounds: false,
        drawingFunction: function (map, perspectivePlayer) {
            var doc = new PIXI.Container();
            var points = perspectivePlayer ? perspectivePlayer.getRevealedStars() : map.stars;
            var _loop_1 = function (i) {
                var star = points[i];
                if (!star.resource) {
                    return "continue";
                }
                switch (star.terrain) {
                    case Terrains.asteroidsTerrain:
                        {
                            var count = 0.0004;
                            var asteroidPositions = generatePointsInPolygon(star.voronoiCell.vertices, count, 10);
                            var gfx_1 = new PIXI.Graphics();
                            gfx_1.beginFill(0x54392F, 1.0);
                            asteroidPositions.forEach(function (asteroidPosition) {
                                gfx_1.drawCircle(asteroidPosition.x, asteroidPosition.y, utility_1.randInt(4, 7));
                            });
                            gfx_1.endFill();
                            doc.addChild(gfx_1);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
            };
            for (var i = 0; i < points.length; i++) {
                _loop_1(i);
            }
            return doc;
        },
    };
});
define("modules/space/mapmodes/mapModeTemplates", ["require", "exports", "modules/space/mapmodes/mapmodetemplates/mapModes"], function (require, exports, MapModes) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapModeTemplates = (_a = {},
        _a[MapModes.defaultMapMode.key] = MapModes.defaultMapMode,
        _a[MapModes.noStatic.key] = MapModes.noStatic,
        _a[MapModes.income.key] = MapModes.income,
        _a[MapModes.resources.key] = MapModes.resources,
        _a);
});
define("modules/space/mapmodes/mapmodetemplates/mapModes", ["require", "exports", "modules/space/mapmodes/allMapLayerTemplates"], function (require, exports, MapLayers) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultMapMode = {
        key: "defaultMapMode",
        displayName: "Default",
        layers: [
            MapLayers.nonFillerVoronoiLines,
            MapLayers.starOwners,
            MapLayers.ownerBorders,
            MapLayers.starLinks,
            MapLayers.nonFillerStars,
            MapLayers.fogOfWar,
            MapLayers.fleets,
        ],
    };
    exports.noStatic = {
        key: "noStatic",
        displayName: "No Static Layers",
        layers: [
            MapLayers.starOwners,
            MapLayers.ownerBorders,
            MapLayers.nonFillerStars,
            MapLayers.fogOfWar,
            MapLayers.fleets,
        ],
    };
    exports.income = {
        key: "income",
        displayName: "Income",
        layers: [
            MapLayers.starIncome,
            MapLayers.nonFillerVoronoiLines,
            MapLayers.starLinks,
            MapLayers.nonFillerStars,
            MapLayers.fleets,
        ],
    };
    exports.resources = {
        key: "resources",
        displayName: "Resources",
        layers: [
            MapLayers.nonFillerVoronoiLines,
            MapLayers.starLinks,
            MapLayers.nonFillerStars,
            MapLayers.fogOfWar,
            MapLayers.fleets,
            MapLayers.resources,
        ],
    };
});
define("modules/space/mapmodes/resources", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resources = {
        fogOfWarTexture: null,
    };
});
define("modules/space/mapmodes/spaceMapModes", ["require", "exports", "pixi.js", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/mapmodes/mapLayerTemplates", "modules/space/mapmodes/mapModeTemplates", "modules/space/mapmodes/resources", "json!modules/space/mapmodes/moduleInfo.json"], function (require, exports, PIXI, englishLanguage_1, GameModuleInitializationPhase_1, mapLayerTemplates_1, mapModeTemplates_1, resources_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceMapModes = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            var loader = new PIXI.Loader(baseUrl);
            loader.add("fowTexture", "./img/fowTexture.png");
            return new Promise(function (resolve) {
                loader.load(function () {
                    resources_1.resources.fogOfWarTexture = loader.resources.fowTexture.texture;
                    resolve();
                });
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(mapLayerTemplates_1.mapLayerTemplates, "MapRendererLayers");
            moduleData.copyTemplates(mapModeTemplates_1.mapModeTemplates, "MapRendererMapModes");
            return moduleData;
        },
    };
});
//# sourceMappingURL=index.js.map