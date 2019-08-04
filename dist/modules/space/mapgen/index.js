define("modules/space/mapgen/common/MapGenPoint", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapGenPoint = (function () {
        function MapGenPoint(x, y) {
            this.mapGenData = {};
            this.x = x;
            this.y = y;
        }
        return MapGenPoint;
    }());
    exports.MapGenPoint = MapGenPoint;
});
define("modules/space/mapgen/common/mapGenUtils", ["require", "exports", "src/Building", "src/Region", "src/Star", "src/pathFinding", "src/utility", "modules/space/buildings/templates/territoryBuildings", "modules/space/mapgen/common/triangulate"], function (require, exports, Building_1, Region_1, Star_1, pathFinding_1, utility_1, territoryBuildings_1, triangulate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function linkStarsByTriangulation(stars) {
        if (stars.length < 3) {
            if (stars.length === 2) {
                stars[0].addLink(stars[1]);
            }
            return;
        }
        var triangles = triangulate_1.triangulate(stars);
        for (var i = 0; i < triangles.length; i++) {
            var edges = triangles[i].getEdges();
            for (var j = 0; j < edges.length; j++) {
                edges[j][0].addLink(edges[j][1]);
            }
        }
    }
    exports.linkStarsByTriangulation = linkStarsByTriangulation;
    function partiallySeverLinks(stars, mapGenDataByStarId, minConnectionsToKeep, maxCuts) {
        stars.forEach(function (star) {
            var cutsDone = 0;
            var neighbors = star.getAllLinks();
            var distanceFromCenter = mapGenDataByStarId[star.id].distanceFromCenter;
            if (neighbors.length > minConnectionsToKeep) {
                for (var j = neighbors.length - 1; j >= 0; j--) {
                    var neighbor = neighbors[j];
                    if (cutsDone < maxCuts) {
                        var neighborLinks = neighbor.getAllLinks();
                        if (neighbors.length <= minConnectionsToKeep || neighborLinks.length <= minConnectionsToKeep) {
                            continue;
                        }
                        var totalLinks = neighbors.length + neighborLinks.length;
                        var cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnectionsToKeep) * (1 - distanceFromCenter);
                        var minMultipleCutThreshhold = 0.15;
                        if (cutThreshhold > 0) {
                            if (Math.random() < cutThreshhold) {
                                star.removeLink(neighbor);
                                neighbors.pop();
                                if (!cutsDone) {
                                    cutsDone = 0;
                                }
                                cutsDone++;
                                var path = pathFinding_1.aStar(star, neighbor);
                                if (!path) {
                                    star.addLink(neighbor);
                                    cutsDone--;
                                    neighbors.push(neighbor);
                                }
                            }
                            cutThreshhold -= minMultipleCutThreshhold;
                        }
                    }
                }
            }
        });
    }
    exports.partiallySeverLinks = partiallySeverLinks;
    function getStarConnectedness(star, maxRange) {
        var connectedness = 0;
        var linkedByRange = star.getLinkedInRange(maxRange).byRange;
        for (var rangeString in linkedByRange) {
            var range = parseInt(rangeString);
            connectedness += linkedByRange[rangeString].length / range;
        }
        return connectedness;
    }
    exports.getStarConnectedness = getStarConnectedness;
    function makeSectors(stars, mapGenDataByStarId, minSize, maxSize) {
        var totalStars = stars.length;
        var averageSize = (minSize + maxSize) / 2;
        var averageSectorsAmount = Math.round(totalStars / averageSize);
        var sectorIdGen = 0;
        var sectorsById = {};
        var sectorsByStarId = {};
        var unassignedStars = stars.slice(0);
        var leftoverStars = [];
        unassignedStars.sort(function (a, b) {
            return mapGenDataByStarId[b.id].connectedness - mapGenDataByStarId[a.id].connectedness;
        });
        var _loop_1 = function () {
            var seedStar = unassignedStars.pop();
            var islandForSameSector = Star_1.Star.getIslandForQualifier([seedStar], null, function (a, b) {
                return sectorsByStarId[a.id] === sectorsByStarId[b.id];
            });
            var canFormMinSizeSector = islandForSameSector.length >= minSize;
            if (canFormMinSizeSector) {
                var sectorId = sectorIdGen++;
                var sector_1 = new Region_1.Region("sector_" + sectorId);
                sectorsById[sectorId] = sector_1;
                var discoveryStarIndex = 0;
                sector_1.addStar(seedStar);
                sectorsByStarId[seedStar.id] = sector_1;
                while (sector_1.stars.length < minSize) {
                    var discoveryStar = sector_1.stars[discoveryStarIndex];
                    var discoveryStarLinkedNeighbors = discoveryStar.getLinkedInRange(1).all;
                    var frontier = discoveryStarLinkedNeighbors.filter(function (star) {
                        var starHasSector = Boolean(sectorsByStarId[star.id]);
                        return !starHasSector;
                    });
                    var _loop_3 = function () {
                        var frontierSortScores = {};
                        frontier.forEach(function (star) {
                            var borderLengthWithSector = sector_1.getBorderLengthWithStars([star]);
                            var borderScore = borderLengthWithSector / 15;
                            var connectedness = mapGenDataByStarId[star.id].connectedness;
                            frontierSortScores[star.id] = borderScore - connectedness;
                        });
                        frontier.sort(function (a, b) {
                            return frontierSortScores[b.id] - frontierSortScores[a.id];
                        });
                        var toAdd = frontier.pop();
                        unassignedStars.splice(unassignedStars.indexOf(toAdd), 1);
                        sector_1.addStar(toAdd);
                        sectorsByStarId[toAdd.id] = sector_1;
                    };
                    while (sector_1.stars.length < minSize && frontier.length > 0) {
                        _loop_3();
                    }
                    discoveryStarIndex++;
                }
            }
            else {
                leftoverStars.push(seedStar);
            }
        };
        while (averageSectorsAmount > 0 && unassignedStars.length > 0) {
            _loop_1();
        }
        var _loop_2 = function () {
            var star = leftoverStars.pop();
            var neighbors = star.getLinkedInRange(1).all;
            var alreadyAddedNeighborSectors = {};
            var candidateSectors = [];
            neighbors.forEach(function (neighbor) {
                var neighborSector = sectorsByStarId[neighbor.id];
                if (neighborSector) {
                    if (!alreadyAddedNeighborSectors[neighborSector.id]) {
                        alreadyAddedNeighborSectors[neighborSector.id] = true;
                        candidateSectors.push(neighborSector);
                    }
                }
            });
            if (candidateSectors.length < 1) {
                leftoverStars.unshift(star);
                return "continue";
            }
            else {
                var unclaimedNeighborsPerSector_1 = {};
                candidateSectors.forEach(function (sector) {
                    var sectorLinkedStars = sector.getLinkedStars();
                    var unclaimedSectorLinkedStars = sectorLinkedStars.filter(function (linkedStar) {
                        return !sectorsByStarId[linkedStar.id];
                    });
                    unclaimedNeighborsPerSector_1[sector.id] = unclaimedSectorLinkedStars.length;
                });
                candidateSectors.sort(function (a, b) {
                    var sizeSort = a.stars.length - b.stars.length;
                    if (sizeSort) {
                        return sizeSort;
                    }
                    var unclaimedSort = unclaimedNeighborsPerSector_1[b.id] -
                        unclaimedNeighborsPerSector_1[a.id];
                    if (sizeSort) {
                        return unclaimedSort;
                    }
                    var perimeterSort = b.getBorderLengthWithStars([star]) - a.getBorderLengthWithStars([star]);
                    if (perimeterSort) {
                        return perimeterSort;
                    }
                    return a.id.localeCompare(b.id);
                });
                candidateSectors[0].addStar(star);
                sectorsByStarId[star.id] = candidateSectors[0];
            }
        };
        while (leftoverStars.length > 0) {
            _loop_2();
        }
        return Object.keys(sectorsById).map(function (sectorId) {
            return sectorsById[sectorId];
        });
    }
    exports.makeSectors = makeSectors;
    function distributeDistributablesPerSector(sectors, distributionFlagsBySectorId, distributablesByDistributionGroup, placerFunction) {
        var probabilityWeights = {};
        var allDistributablesByType = {};
        var addedDistributablesByRegionId = {};
        for (var distributionGroup in distributablesByDistributionGroup) {
            var distributables = distributablesByDistributionGroup[distributionGroup];
            distributables.forEach(function (distributable) {
                probabilityWeights[distributable.type] = distributable.distributionData.weight;
                allDistributablesByType[distributable.type] = distributable;
            });
        }
        sectors.forEach(function (sector) {
            var alreadyAddedByWeight = utility_1.getRelativeWeightsFromObject(probabilityWeights);
            var distributionFlags = distributionFlagsBySectorId[sector.id];
            var distributablesForSector = distributionFlags.reduce(function (distributables, flag) {
                return distributables.concat(distributablesByDistributionGroup[flag]);
            }, []);
            if (distributablesForSector.length < 1) {
                return;
            }
            var linkedNeighborRegions = sector.getLinkedRegions(sectors);
            var candidatesNotInNeighboringSectors = distributablesForSector.filter(function (candidate) {
                return linkedNeighborRegions.some(function (linkedRegion) {
                    return (addedDistributablesByRegionId[linkedRegion.id] &&
                        addedDistributablesByRegionId[linkedRegion.id][candidate.type]);
                });
            });
            var candidates = candidatesNotInNeighboringSectors.length > 0 ?
                candidatesNotInNeighboringSectors :
                distributablesForSector;
            var candidatesByWeight = {};
            candidates.forEach(function (candidate) {
                candidatesByWeight[candidate.type] = alreadyAddedByWeight[candidate.type];
            });
            var selectedKey = utility_1.getRandomKeyWithWeights(candidatesByWeight);
            var selectedType = allDistributablesByType[selectedKey];
            probabilityWeights[selectedKey] /= 2;
            placerFunction(sector, selectedType);
            if (!addedDistributablesByRegionId[sector.id]) {
                addedDistributablesByRegionId[sector.id] = {};
            }
            addedDistributablesByRegionId[sector.id][selectedKey] = true;
        });
    }
    exports.distributeDistributablesPerSector = distributeDistributablesPerSector;
    function addTerritoryBuildings(star, amount, addSectorCommand) {
        if (amount === void 0) { amount = 1; }
        if (addSectorCommand === void 0) { addSectorCommand = true; }
        var buildingsToAdd = amount;
        if (!star.owner) {
            console.warn("Tried to add defence buildings to star without owner.");
            return;
        }
        if (buildingsToAdd < 1) {
            return;
        }
        if (addSectorCommand) {
            star.buildings.add(new Building_1.Building({
                template: territoryBuildings_1.sectorCommand,
                location: star,
            }));
            buildingsToAdd -= 1;
        }
        for (var i = 0; i < buildingsToAdd; i++) {
            star.buildings.add(new Building_1.Building({
                template: territoryBuildings_1.starBase,
                location: star,
            }));
        }
    }
    exports.addTerritoryBuildings = addTerritoryBuildings;
    function severLinksToNonAdjacentStars(star) {
        var allLinks = star.getAllLinks();
        var neighbors = star.getNeighbors();
        allLinks.forEach(function (linkedStar) {
            if (neighbors.indexOf(linkedStar) === -1) {
                star.removeLink(linkedStar);
            }
        });
    }
    exports.severLinksToNonAdjacentStars = severLinksToNonAdjacentStars;
});
define("modules/space/mapgen/common/setupIndependents", ["require", "exports", "src/activeModuleData", "src/utility", "modules/space/mapgen/common/mapGenUtils"], function (require, exports, activeModuleData_1, utility_1, mapGenUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function setupIndependents(props) {
        var independentStars = props.region.stars.filter(function (star) {
            return !star.owner || star.owner.isIndependent;
        });
        independentStars.forEach(function (star) {
            props.player.addStar(star);
            mapGenUtils_1.addTerritoryBuildings(star, 1, false);
        });
        var starsByDistance = getStarsByDistanceToPlayer(independentStars, props.mapGenDataByStarId);
        var maxDistanceFromPlayer = getMaxDistanceFromStarsByDistance(starsByDistance);
        var starsAtMaxDistance = starsByDistance[maxDistanceFromPlayer];
        var commanderStar = getMostSuitableCommanderStarFromStars(starsAtMaxDistance, props.mapGenDataByStarId);
        var globalMaxDistanceFromPlayer = (function () {
            var maxDistance = 0;
            for (var starId in props.mapGenDataByStarId) {
                var distance = props.mapGenDataByStarId[starId].distanceFromPlayerOwnedLocation;
                maxDistance = Math.max(maxDistance, distance);
            }
            return maxDistance;
        })();
        independentStars.forEach(function (star) {
            var mapGenData = props.mapGenDataByStarId[star.id];
            var distanceFromPlayer = mapGenData.distanceFromPlayerOwnedLocation - 1;
            var relativeDistanceFromPlayer = distanceFromPlayer / globalMaxDistanceFromPlayer;
            var globalStrength = Math.pow(relativeDistanceFromPlayer, 1.8) * props.intensity + utility_1.randRange(-props.variance, props.variance);
            var localStrength = star === commanderStar ? 1 : 0.5;
            star.localRace.generateIndependentFleets(props.player, star, globalStrength, localStrength, activeModuleData_1.activeModuleData.ruleSet.battle.maxUnitsPerSide);
        });
    }
    exports.setupIndependents = setupIndependents;
    function getStarsByDistanceToPlayer(stars, mapGenDataByStarId) {
        var starsByDistance = {};
        stars.forEach(function (star) {
            var distance = mapGenDataByStarId[star.id].distanceFromPlayerOwnedLocation;
            if (!starsByDistance[distance]) {
                starsByDistance[distance] = [];
            }
            starsByDistance[distance].push(star);
        });
        return starsByDistance;
    }
    function getMaxDistanceFromStarsByDistance(starsByDistance) {
        var numericDistances = Object.keys(starsByDistance).map(function (distanceString) {
            return parseInt(distanceString);
        });
        var maxDistance = Math.max.apply(null, numericDistances);
        return maxDistance;
    }
    function getMostSuitableCommanderStarFromStars(stars, mapGenDataByStarId) {
        return stars.sort(function (a, b) {
            var connectednessSort = mapGenDataByStarId[b.id].connectedness - mapGenDataByStarId[a.id].connectedness;
            if (connectednessSort) {
                return connectednessSort;
            }
            else {
                return mapGenDataByStarId[b.id].distanceFromCenter - mapGenDataByStarId[a.id].distanceFromCenter;
            }
        })[0];
    }
});
define("modules/space/mapgen/common/Triangle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Triangle = (function () {
        function Triangle(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
        Triangle.prototype.getPoints = function () {
            return [this.a, this.b, this.c];
        };
        Triangle.prototype.calculateCircumCircle = function (tolerance) {
            if (tolerance === void 0) { tolerance = 0.00001; }
            var pA = this.a;
            var pB = this.b;
            var pC = this.c;
            var m1;
            var m2;
            var mx1;
            var mx2;
            var my1;
            var my2;
            var cX;
            var cY;
            if (Math.abs(pB.y - pA.y) < tolerance) {
                m2 = -(pC.x - pB.x) / (pC.y - pB.y);
                mx2 = (pB.x + pC.x) * 0.5;
                my2 = (pB.y + pC.y) * 0.5;
                cX = (pB.x + pA.x) * 0.5;
                cY = m2 * (cX - mx2) + my2;
            }
            else {
                m1 = -(pB.x - pA.x) / (pB.y - pA.y);
                mx1 = (pA.x + pB.x) * 0.5;
                my1 = (pA.y + pB.y) * 0.5;
                if (Math.abs(pC.y - pB.y) < tolerance) {
                    cX = (pC.x + pB.x) * 0.5;
                    cY = m1 * (cX - mx1) + my1;
                }
                else {
                    m2 = -(pC.x - pB.x) / (pC.y - pB.y);
                    mx2 = (pB.x + pC.x) * 0.5;
                    my2 = (pB.y + pC.y) * 0.5;
                    cX = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
                    cY = m1 * (cX - mx1) + my1;
                }
            }
            this.circumCenterX = cX;
            this.circumCenterY = cY;
            mx1 = pB.x - cX;
            my1 = pB.y - cY;
            this.circumRadius = Math.sqrt(mx1 * mx1 + my1 * my1);
        };
        Triangle.prototype.circumCircleContainsPoint = function (point) {
            this.calculateCircumCircle();
            var x = point.x - this.circumCenterX;
            var y = point.y - this.circumCenterY;
            var contains = x * x + y * y <= this.circumRadius * this.circumRadius;
            return (contains);
        };
        Triangle.prototype.getEdges = function () {
            var edges = [
                [this.a, this.b],
                [this.b, this.c],
                [this.c, this.a],
            ];
            return edges;
        };
        Triangle.prototype.getAmountOfSharedVerticesWith = function (toCheckAgainst) {
            var ownPoints = this.getPoints();
            var otherPoints = toCheckAgainst.getPoints();
            var shared = 0;
            for (var i = 0; i < ownPoints.length; i++) {
                if (otherPoints.indexOf(ownPoints[i]) >= 0) {
                    shared++;
                }
            }
            return shared;
        };
        Triangle.prototype.getArea = function () {
            return Math.abs(this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y)) / 2;
        };
        Triangle.prototype.getRandomPoint = function () {
            var r1 = Math.random();
            var r2 = Math.random();
            var v1 = [r1 * (this.b.x - this.a.x), r1 * (this.b.y - this.a.y)];
            var v2 = [r2 * (this.c.x - this.a.x), r2 * (this.c.y - this.a.y)];
            var x = v1[0] + v2[0];
            var y = v1[1] + v2[1];
            if (r1 + r2 > 1) {
                return this.getRandomPoint();
            }
            else {
                return ({
                    x: x + this.a.x,
                    y: y + this.a.y,
                });
            }
        };
        return Triangle;
    }());
    exports.Triangle = Triangle;
});
define("modules/space/mapgen/common/triangulate", ["require", "exports", "src/utility", "modules/space/mapgen/common/Triangle"], function (require, exports, utility_1, Triangle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function triangulate(vertices) {
        var triangles = [];
        var superTriangle = makeSuperTriangle(vertices);
        triangles.push(superTriangle);
        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            var edgeBuffer = [];
            for (var j = 0; j < triangles.length; j++) {
                var triangle = triangles[j];
                if (triangle.circumCircleContainsPoint(vertex)) {
                    var edges = triangle.getEdges();
                    edgeBuffer.push.apply(edgeBuffer, edges);
                    triangles.splice(j, 1);
                    j--;
                }
            }
            if (i >= vertices.length) {
                continue;
            }
            for (var j = edgeBuffer.length - 2; j >= 0; j--) {
                for (var k = edgeBuffer.length - 1; k >= j + 1; k--) {
                    if (edgesEqual(edgeBuffer[k], edgeBuffer[j])) {
                        edgeBuffer.splice(k, 1);
                        edgeBuffer.splice(j, 1);
                        k--;
                        continue;
                    }
                }
            }
            for (var j = 0; j < edgeBuffer.length; j++) {
                var newTriangle = new Triangle_1.Triangle(edgeBuffer[j][0], edgeBuffer[j][1], vertex);
                triangles.push(newTriangle);
            }
        }
        for (var i = triangles.length - 1; i >= 0; i--) {
            if (triangles[i].getAmountOfSharedVerticesWith(superTriangle)) {
                triangles.splice(i, 1);
            }
        }
        var trianglesWithoutSuperTriangle = triangles.filter(function (triangle) {
            var verticesSharedWithSuperTriangle = triangle.getAmountOfSharedVerticesWith(superTriangle);
            return verticesSharedWithSuperTriangle === 0;
        });
        return trianglesWithoutSuperTriangle;
    }
    exports.triangulate = triangulate;
    function makeSuperTriangle(vertices, highestCoordinateValue) {
        var max;
        if (highestCoordinateValue) {
            max = highestCoordinateValue;
        }
        else {
            max = vertices[0].x;
            for (var i = 0; i < vertices.length; i++) {
                if (vertices[i].x > max) {
                    max = vertices[i].x;
                }
                if (vertices[i].y > max) {
                    max = vertices[i].y;
                }
            }
        }
        var triangle = new Triangle_1.Triangle({
            x: 3 * max,
            y: 0,
        }, {
            x: 0,
            y: 3 * max,
        }, {
            x: -3 * max,
            y: -3 * max,
        });
        return triangle;
    }
    function edgesEqual(e1, e2) {
        return ((utility_1.pointsEqual(e1[0], e2[0]) && utility_1.pointsEqual(e1[1], e2[1])) ||
            (utility_1.pointsEqual(e1[0], e2[1]) && utility_1.pointsEqual(e1[1], e2[0])));
    }
});
define("modules/space/mapgen/spaceMapGen", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/mapgen/templates/spiralGalaxy", "modules/space/mapgen/templates/tinierSpiralGalaxy", "json!modules/space/mapgen/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, spiralGalaxy_1, tinierSpiralGalaxy_1, moduleInfo) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    var templates = (_a = {},
        _a[spiralGalaxy_1.spiralGalaxy.key] = spiralGalaxy_1.spiralGalaxy,
        _a[tinierSpiralGalaxy_1.tinierSpiralGalaxy.key] = tinierSpiralGalaxy_1.tinierSpiralGalaxy,
        _a);
    exports.spaceMapGen = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(templates, "MapGen");
            if (!moduleData.defaultMap) {
                moduleData.defaultMap = spiralGalaxy_1.spiralGalaxy;
            }
            return moduleData;
        },
    };
});
define("modules/space/mapgen/spiralGalaxy/generateSpiralPoints", ["require", "exports", "src/utility", "modules/space/mapgen/common/MapGenPoint"], function (require, exports, utility_1, MapGenPoint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.centerRegionTag = "center";
    function generateSpiralPoints(options) {
        var sg = convertMapGenOptionValues(options);
        var makePoint = function (distanceMin, distanceMax, arm, maxOffset) {
            var distance = utility_1.randRange(distanceMin, distanceMax);
            var offset = Math.random() * maxOffset - maxOffset / 2;
            offset *= (1 / distance);
            if (offset < 0) {
                offset = Math.pow(offset, 2) * -1;
            }
            else {
                offset = Math.pow(offset, 2);
            }
            var armRotation = distance * sg.armRotationFactor;
            var angle = arm * sg.armDistance + sg.galaxyRotation + offset + armRotation;
            var width = options.defaultOptions.width / 2;
            var height = options.defaultOptions.height / 2;
            var x = Math.cos(angle) * distance * width + width;
            var y = Math.sin(angle) * distance * height + height;
            var point = new MapGenPoint_1.MapGenPoint(x, y);
            point.mapGenData.distanceFromCenter = distance;
            return point;
        };
        var points = [];
        for (var i = 0; i < sg.totalArms; i++) {
            var currentArmIsFiller = i % 2 !== 0;
            var amountForThisArm = currentArmIsFiller ? sg.amountPerFillerArm : sg.amountPerArm;
            var shouldMakeUpDeficitForThisArm = sg.armsToMakeUpDeficit.indexOf(i) !== -1;
            var amountForThisCenter = sg.amountPerCenter +
                (shouldMakeUpDeficitForThisArm ? sg.starsToAddPerDeficitArm : 0);
            var maxOffsetForThisArm = currentArmIsFiller ? sg.armOffsetMax / 2 : sg.armOffsetMax;
            for (var j = 0; j < amountForThisArm; j++) {
                var point = makePoint(sg.centerSize, 1, i, maxOffsetForThisArm);
                points.push(point);
                point.mapGenData.tags = ["arm_" + i];
                point.mapGenData.isFiller = currentArmIsFiller;
            }
            for (var j = 0; j < amountForThisCenter; j++) {
                var point = makePoint(0, sg.centerSize, i, maxOffsetForThisArm);
                points.push(point);
                point.mapGenData.tags = [exports.centerRegionTag];
                point.mapGenData.isFiller = false;
            }
        }
        return points;
    }
    exports.generateSpiralPoints = generateSpiralPoints;
    function convertMapGenOptionValues(options) {
        var totalStars = options.defaultOptions.starCount;
        var actualArms = options.basicOptions.arms;
        var totalArms = actualArms * 2;
        var percentageInCenter = 0.3;
        var percentageInArms = 1 - percentageInCenter;
        var amountInCenter = totalStars * percentageInCenter;
        var amountPerArm = Math.round(totalStars / actualArms * percentageInArms);
        var amountPerFillerArm = Math.round(amountPerArm / 2);
        var amountPerCenter = Math.round(amountInCenter / totalArms);
        var actualStarsInArms = actualArms * amountPerArm;
        var actualStarsInCenter = totalArms * amountPerCenter;
        var actualStars = actualStarsInCenter + actualStarsInArms;
        var starsDeficit = totalStars - actualStars;
        var armsToMakeUpDeficit = [];
        var starsToAddPerDeficitArm = 0;
        if (starsDeficit !== 0) {
            starsToAddPerDeficitArm = starsDeficit > 0 ? 1 : -1;
            var deficitStep = totalArms / Math.abs(starsDeficit);
            for (var i = 0; i < totalArms; i += deficitStep) {
                armsToMakeUpDeficit.push(Math.round(i));
            }
        }
        return ({
            totalArms: totalArms,
            armsToMakeUpDeficit: armsToMakeUpDeficit,
            starsToAddPerDeficitArm: starsToAddPerDeficitArm,
            amountPerArm: amountPerArm,
            amountPerFillerArm: amountPerFillerArm,
            amountPerCenter: amountPerCenter,
            centerSize: 0.4,
            armDistance: Math.PI * 2 / totalArms,
            armOffsetMax: 0.5,
            armRotationFactor: actualArms / 3,
            galaxyRotation: utility_1.randRange(0, Math.PI * 2),
        });
    }
});
define("modules/space/mapgen/spiralGalaxy/spiralGalaxyGeneration", ["require", "exports", "rng-js", "src/FillerPoint", "src/MapGenResult", "src/Region", "src/Star", "src/TemplateIndexes", "src/activeModuleData", "src/utility", "src/voronoi", "modules/space/terrains/terrains", "modules/space/mapgen/common/mapGenUtils", "modules/space/mapgen/common/setupIndependents", "modules/space/mapgen/spiralGalaxy/generateSpiralPoints"], function (require, exports, RNG, FillerPoint_1, MapGenResult_1, Region_1, Star_1, TemplateIndexes_1, activeModuleData_1, utility_1, voronoi_1, Terrains, mapGenUtils_1, setupIndependents_1, generateSpiralPoints_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spiralGalaxyGeneration = function (options, players) {
        var seed = "" + Math.random();
        var oldRandom = Math.random;
        Math.random = RNG.prototype.uniform.bind(new RNG(seed));
        var points = generateSpiralPoints_1.generateSpiralPoints(options);
        var diagramToRelax = voronoi_1.makeVoronoi(points, options.defaultOptions.width, options.defaultOptions.height);
        applyVoronoiRelaxationToPoints(diagramToRelax, {
            areaRegularity: options.basicOptions.starSizeRegularity / 100,
            centerDensity: options.basicOptions.centerDensity / 100,
            iterations: 2,
        });
        var starsWithMapGenPoints = [];
        var stars = [];
        var fillerPoints = [];
        points.forEach(function (point) {
            if (point.mapGenData.isFiller) {
                var fillerPoint = new FillerPoint_1.FillerPoint(point.x, point.y);
                fillerPoints.push(fillerPoint);
            }
            else {
                var star = new Star_1.Star({
                    x: point.x,
                    y: point.y,
                });
                stars.push(star);
                starsWithMapGenPoints.push({
                    star: star,
                    mapGenpoint: point,
                });
            }
        });
        var allPoints = stars.concat(fillerPoints);
        var diagram = voronoi_1.makeVoronoi(allPoints, options.defaultOptions.width, options.defaultOptions.height);
        voronoi_1.setVoronoiCells(diagram.cells);
        var mapGenDataByStarId = {};
        starsWithMapGenPoints.forEach(function (starWithMapGenPoint) {
            mapGenDataByStarId[starWithMapGenPoint.star.id] =
                starWithMapGenPoint.mapGenpoint.mapGenData;
        });
        var regions = [];
        var regionsById = {};
        starsWithMapGenPoints.forEach(function (starWithMapGenPoint) {
            var tags = starWithMapGenPoint.mapGenpoint.mapGenData.tags;
            tags.forEach(function (tag) {
                if (!regionsById[tag]) {
                    regionsById[tag] = new Region_1.Region(tag);
                    regions.push(regionsById[tag]);
                }
                regionsById[tag].addStar(starWithMapGenPoint.star);
            });
        });
        stars.forEach(function (star) {
            star.getNeighbors().filter(function (point) {
                return isFinite(point.id);
            }).forEach(function (neighbor) {
                star.addLink(neighbor);
            });
        });
        var armRegions = regions.filter(function (region) {
            return region !== regionsById[generateSpiralPoints_1.centerRegionTag];
        });
        armRegions.forEach(function (region) {
            region.severLinksToRegionsExcept([region, regionsById[generateSpiralPoints_1.centerRegionTag]]);
        });
        var entireMapIsConnected = stars[0].getAllLinkedStars().length === stars.length;
        if (!entireMapIsConnected) {
            console.log("Regenerated map due to insufficient connections");
            return exports.spiralGalaxyGeneration(options, players);
        }
        mapGenUtils_1.partiallySeverLinks(stars, mapGenDataByStarId, 4, 2);
        stars.forEach(function (star) {
            mapGenDataByStarId[star.id].connectedness = mapGenUtils_1.getStarConnectedness(star, 3);
        });
        var sectors = mapGenUtils_1.makeSectors(stars, mapGenDataByStarId, 3, 3);
        var distributionFlagsBySectorId = {};
        sectors.forEach(function (sector) {
            var distributionFlagsByKeyWord = {
                arm: "common",
                center: "rare",
            };
            var foundDistributionFlags = {
                common: false,
                rare: false,
            };
            var distributionFlags = [];
            var majorityRegions = sector.getMajorityRegions(regions);
            majorityRegions.forEach(function (region) {
                for (var keyWord in distributionFlagsByKeyWord) {
                    if (region.id.indexOf(keyWord) !== -1) {
                        var distributionFlag = distributionFlagsByKeyWord[keyWord];
                        if (!foundDistributionFlags[distributionFlag]) {
                            foundDistributionFlags[distributionFlag] = true;
                            distributionFlags.push(distributionFlag);
                        }
                    }
                }
                distributionFlagsBySectorId[sector.id] = distributionFlags;
            });
        });
        var getStartingRegions = function () {
            var nonCenterRegions = regions.filter(function (region) {
                return region.id.indexOf(generateSpiralPoints_1.centerRegionTag) === -1;
            });
            var armCount = options.basicOptions.arms;
            var playersInArmsCount = Math.min(players.length, armCount);
            var playerArmStep = armCount / playersInArmsCount;
            var armStartingRegions = [];
            for (var i = 0; i < playersInArmsCount; i++) {
                var regionNumber = Math.floor(i * playerArmStep);
                var regionToAdd = nonCenterRegions[regionNumber];
                armStartingRegions.push(regionToAdd);
            }
            var centerStartingRegions = [];
            var leftOverPlayerCount = playersInArmsCount - armCount;
            for (var i = 0; i < leftOverPlayerCount; i++) {
                centerStartingRegions.push(regionsById[generateSpiralPoints_1.centerRegionTag]);
            }
            return armStartingRegions.concat(centerStartingRegions);
        };
        var startRegions = getStartingRegions();
        var startPositions = startRegions.map(function (startRegion) {
            var starsByDistanceFromCenter = startRegion.stars.slice(0).sort(function (a, b) {
                return mapGenDataByStarId[b.id].distanceFromCenter - mapGenDataByStarId[a.id].distanceFromCenter;
            });
            var starFurthestAwayFromCenter = starsByDistanceFromCenter[0];
            return starFurthestAwayFromCenter;
        });
        for (var i = 0; i < startPositions.length; i++) {
            var star = startPositions[i];
            var player = players[i];
            player.addStar(star);
            star.localRace = player.race;
            mapGenUtils_1.addTerritoryBuildings(star, 2);
            star.buildManufactory();
        }
        var starIsPlayerOwned = (function (star) {
            return star.owner && !star.owner.isIndependent;
        });
        stars.forEach(function (star) {
            var nearestPlayerStar = star.getNearestStarForQualifier(starIsPlayerOwned);
            var distanceToPlayer = star.getDistanceToStar(nearestPlayerStar);
            mapGenDataByStarId[star.id].distanceFromPlayerOwnedLocation = distanceToPlayer;
        });
        var racePlacerFN = function (sector, race) {
            var existingStarsWithRace = sector.stars.filter(function (star) { return Boolean(star.localRace); });
            var existingRaceInSector = existingStarsWithRace.length > 0 ? existingStarsWithRace[0].localRace : null;
            sector.stars.forEach(function (star) {
                star.localRace = existingRaceInSector || race;
            });
        };
        mapGenUtils_1.distributeDistributablesPerSector(sectors, distributionFlagsBySectorId, TemplateIndexes_1.templateIndexes.distributablesByDistributionGroup.races, racePlacerFN);
        var resourcePlacerFN = function (sector, resource) {
            sector.stars[0].resource = resource;
        };
        mapGenUtils_1.distributeDistributablesPerSector(sectors, distributionFlagsBySectorId, TemplateIndexes_1.templateIndexes.distributablesByDistributionGroup.resources, resourcePlacerFN);
        stars.forEach(function (star) {
            if (star.resource) {
                star.terrain = Terrains.asteroidsTerrain;
            }
            else {
                star.terrain = Terrains.noneTerrain;
            }
        });
        var independents = [];
        sectors.forEach(function (sector) {
            var sectorRace = sector.stars[0].localRace;
            var sectorIndependents = sectorRace.generateIndependentPlayer(activeModuleData_1.activeModuleData.templates.SubEmblems);
            independents.push(sectorIndependents);
            setupIndependents_1.setupIndependents({
                player: sectorIndependents,
                region: sector,
                intensity: 1,
                variance: 0,
                mapGenDataByStarId: mapGenDataByStarId,
            });
        });
        stars.forEach(function (star) {
            star.baseIncome = utility_1.randInt(4, 6) * 10;
        });
        Math.random = oldRandom;
        return new MapGenResult_1.MapGenResult({
            stars: stars,
            fillerPoints: fillerPoints,
            width: options.defaultOptions.width,
            height: options.defaultOptions.height,
            seed: seed,
            independents: independents,
        });
    };
    function applyVoronoiRelaxationToPoints(diagram, props) {
        var inverseCenterDensity = 1 - props.centerDensity;
        var getRelaxAmountFN = function (point) {
            return (inverseCenterDensity + props.centerDensity * point.mapGenData.distanceFromCenter) * props.areaRegularity;
        };
        for (var i = 0; i < props.iterations; i++) {
            voronoi_1.relaxVoronoi(diagram, getRelaxAmountFN);
        }
    }
});
define("modules/space/mapgen/spiralGalaxy/SpiralGalaxyOptionValues", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("modules/space/mapgen/templates/spiralGalaxy", ["require", "exports", "modules/space/mapgen/spiralGalaxy/spiralGalaxyGeneration"], function (require, exports, spiralGalaxyGeneration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spiralGalaxy = {
        key: "spiralGalaxy",
        displayName: "Spiral galaxy",
        description: "Create a spiral galaxy with arms",
        minPlayers: 2,
        maxPlayers: 5,
        mapGenFunction: spiralGalaxyGeneration_1.spiralGalaxyGeneration,
        options: {
            defaultOptions: {
                height: {
                    displayName: "Height",
                    range: {
                        min: 800,
                        max: 1600,
                        step: 1,
                    },
                },
                width: {
                    displayName: "Width",
                    range: {
                        min: 800,
                        max: 1600,
                        step: 1,
                    },
                },
                starCount: {
                    displayName: "Star count",
                    range: {
                        min: 20,
                        max: 40,
                        step: 1,
                    },
                },
            },
            basicOptions: {
                arms: {
                    displayName: "Arms",
                    range: {
                        min: 3,
                        max: 6,
                        step: 1,
                        defaultValue: 5,
                    },
                },
                starSizeRegularity: {
                    displayName: "Star size regularity",
                    range: {
                        min: 1,
                        max: 100,
                        step: 1,
                        defaultValue: 100,
                    },
                },
                centerDensity: {
                    displayName: "Center density",
                    range: {
                        min: 1,
                        max: 90,
                        step: 1,
                        defaultValue: 50,
                    },
                },
            },
        },
    };
});
define("modules/space/mapgen/templates/tinierSpiralGalaxy", ["require", "exports", "modules/space/mapgen/spiralGalaxy/spiralGalaxyGeneration"], function (require, exports, spiralGalaxyGeneration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tinierSpiralGalaxy = {
        key: "tinierSpiralGalaxy",
        displayName: "Tinier Spiral galaxy",
        description: "Create a spiral galaxy with arms but tinier (just for testing)",
        minPlayers: 2,
        maxPlayers: 4,
        mapGenFunction: spiralGalaxyGeneration_1.spiralGalaxyGeneration,
        options: {
            defaultOptions: {
                height: {
                    displayName: "Height",
                    range: {
                        min: 500,
                        max: 1000,
                        step: 1,
                    },
                },
                width: {
                    displayName: "Width",
                    range: {
                        min: 500,
                        max: 1000,
                        step: 1,
                    },
                },
                starCount: {
                    displayName: "Star count",
                    range: {
                        min: 15,
                        max: 30,
                        step: 1,
                        defaultValue: 20,
                    },
                },
            },
            basicOptions: {
                arms: {
                    displayName: "Arms",
                    range: {
                        min: 2,
                        max: 5,
                        step: 1,
                        defaultValue: 4,
                    },
                },
                starSizeRegularity: {
                    displayName: "Star size regularity",
                    range: {
                        min: 1,
                        max: 100,
                        step: 1,
                        defaultValue: 100,
                    },
                },
                centerDensity: {
                    displayName: "Center density",
                    range: {
                        min: 1,
                        max: 90,
                        step: 1,
                        defaultValue: 50,
                    },
                },
            },
        },
    };
});
//# sourceMappingURL=index.js.map