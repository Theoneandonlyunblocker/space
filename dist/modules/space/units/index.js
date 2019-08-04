define("modules/space/units/defaultUnitDrawingFunction", ["require", "exports", "pixi.js", "src/UnitDrawingFunctionData", "src/utility"], function (require, exports, PIXI, UnitDrawingFunctionData_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeDefaultUnitDrawingFunction(spriteData, imageSrc) {
        return defaultUnitDrawingFunction.bind(null, spriteData, imageSrc);
    }
    exports.makeDefaultUnitDrawingFunction = makeDefaultUnitDrawingFunction;
    function defaultUnitDrawingFunction(spriteData, imageSrc, unit, vfxParams) {
        var container = new PIXI.Container();
        var texture = PIXI.Texture.from(imageSrc);
        var props = {
            zDistance: 8,
            xDistance: 5,
            maxUnitsPerColumn: 7,
            curvature: -0.5,
            rotationAngle: 70,
            scalingFactor: 0.04,
        };
        var maxUnitsPerColumn = props.maxUnitsPerColumn;
        var maxColumns = 3;
        var isConvex = props.curvature >= 0;
        var curvature = Math.abs(props.curvature);
        var zDistance = props.zDistance;
        var xDistance = props.xDistance;
        var unitsToDraw;
        if (!unit.template.isSquadron) {
            unitsToDraw = 1;
        }
        else {
            var lastHealthDrawnAt = unit.lastHealthDrawnAt || unit.battleStats.lastHealthBeforeReceivingDamage;
            unit.lastHealthDrawnAt = unit.currentHealth;
            unitsToDraw = Math.round(lastHealthDrawnAt * 0.04);
            var desiredHeightRatio = 25 / texture.height;
            var heightRatio = Math.min(desiredHeightRatio, 1.25);
            maxUnitsPerColumn = Math.round(maxUnitsPerColumn * heightRatio);
            unitsToDraw = Math.round(unitsToDraw * heightRatio);
            zDistance *= (1 / heightRatio);
            unitsToDraw = utility_1.clamp(unitsToDraw, 1, maxUnitsPerColumn * maxColumns);
        }
        var rotationAngle = Math.PI / 180 * props.rotationAngle;
        var sA = Math.sin(rotationAngle);
        var cA = Math.cos(rotationAngle);
        var rotationMatrix = [
            1, 0, 0,
            0, cA, -sA,
            0, sA, cA,
        ];
        var minXOffset = isConvex ? 0 : Math.sin(Math.PI / (maxUnitsPerColumn + 1));
        var yPadding = Math.min(vfxParams.height * 0.1, 30);
        var desiredHeight = vfxParams.height - yPadding;
        var averageHeight = texture.height * (maxUnitsPerColumn / 2 * props.scalingFactor);
        var spaceToFill = desiredHeight - (averageHeight * maxUnitsPerColumn);
        zDistance = spaceToFill / maxUnitsPerColumn * 1.35;
        var boundingBox = {
            x1: undefined,
            x2: undefined,
            y1: undefined,
            y2: undefined,
        };
        var allUnitBoundingBoxes = [];
        var primaryAttackOriginPoint;
        var sequentialAttackOriginPoints = [];
        var allSprites = [];
        var lastColumn = Math.floor(unitsToDraw / maxUnitsPerColumn);
        var maxUnitsInLastColumn = unitsToDraw % maxUnitsPerColumn;
        var firstIndexForLastColumn = maxUnitsPerColumn * lastColumn;
        var unitsInFirstColumn = lastColumn > 0 ? maxUnitsPerColumn : unitsToDraw;
        var centermostUnitInFirstColumn = Math.ceil(unitsInFirstColumn / 2) - 1;
        for (var i = 0; i < unitsToDraw; i++) {
            var column = Math.floor(i / maxUnitsPerColumn);
            var columnFromRight = lastColumn - column;
            var zPos = void 0;
            if (column === lastColumn) {
                if (maxUnitsInLastColumn === 1) {
                    zPos = (maxUnitsPerColumn - 1) / 2;
                }
                else {
                    var positionInLastColumn = i - firstIndexForLastColumn;
                    zPos = positionInLastColumn * ((maxUnitsPerColumn - 1) / (maxUnitsInLastColumn - 1));
                }
            }
            else {
                zPos = i % maxUnitsPerColumn;
            }
            var xOffset = Math.sin(Math.PI / (maxUnitsPerColumn + 1) * (zPos + 1));
            if (isConvex) {
                xOffset = 1 - xOffset;
            }
            xOffset -= minXOffset;
            var scale = 1 - zPos * props.scalingFactor;
            var scaledWidth = texture.width * scale;
            var scaledHeight = texture.height * scale;
            var x = xOffset * scaledWidth * curvature + columnFromRight * (scaledWidth + xDistance * scale);
            var y = (scaledHeight + zDistance * scale) * (maxUnitsPerColumn - zPos);
            var translated = utility_1.transformMat3({ x: x, y: y }, rotationMatrix);
            x = Math.round(translated.x);
            y = Math.round(translated.y);
            var attackOriginPoint = {
                x: x + scaledWidth * spriteData.attackOriginPoint.x,
                y: y + scaledHeight * spriteData.attackOriginPoint.y,
            };
            sequentialAttackOriginPoints.push(attackOriginPoint);
            if (column === 0 && i === centermostUnitInFirstColumn) {
                primaryAttackOriginPoint = attackOriginPoint;
            }
            var sprite = new PIXI.Sprite(texture);
            sprite.scale.x = sprite.scale.y = scale;
            sprite.x = x;
            sprite.y = y;
            container.addChild(sprite);
            allSprites.push(sprite);
            var unitBounds = new PIXI.Rectangle(x, y, scaledWidth, scaledHeight);
            allUnitBoundingBoxes.push(unitBounds);
            boundingBox.x1 = isFinite(boundingBox.x1) ? Math.min(boundingBox.x1, x) : x;
            boundingBox.y1 = isFinite(boundingBox.y1) ? Math.min(boundingBox.y1, y) : y;
            boundingBox.x2 = isFinite(boundingBox.x2) ? Math.max(boundingBox.x2, x + scaledWidth) : x + scaledWidth;
            boundingBox.y2 = isFinite(boundingBox.y2) ? Math.max(boundingBox.y2, y + scaledHeight) : y + scaledHeight;
        }
        vfxParams.triggerStart(container);
        return new UnitDrawingFunctionData_1.UnitDrawingFunctionData({
            boundingBox: new PIXI.Rectangle(boundingBox.x1, boundingBox.y1, boundingBox.x2 - boundingBox.x1, boundingBox.y2 - boundingBox.y1),
            individualUnitBoundingBoxes: allUnitBoundingBoxes,
            singleAttackOriginPoint: primaryAttackOriginPoint,
            sequentialAttackOriginPoints: sequentialAttackOriginPoints,
            individualUnitDisplayObjects: allSprites,
        });
    }
});
define("modules/space/units/resources", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iconSources = {
        b: "./img/icons/b.png",
        bc: "./img/icons/bc.png",
        f: "./img/icons/f.png",
        fa: "./img/icons/fa.png",
        fb: "./img/icons/fb.png",
        sc: "./img/icons/sc.png",
        sh: "./img/icons/sh.png",
    };
    var baseUrl = "";
    function setBaseUrl(newUrl) {
        baseUrl = newUrl;
    }
    exports.setBaseUrl = setBaseUrl;
    function getIconSrc(type) {
        return new URL(exports.iconSources[type], baseUrl).toString();
    }
    exports.getIconSrc = getIconSrc;
});
define("modules/space/units/spaceUnits", ["require", "exports", "pixi.js", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/common/unitArchetypes", "modules/space/units/unitTemplates", "modules/space/units/resources", "json!modules/space/units/moduleInfo.json"], function (require, exports, PIXI, englishLanguage_1, GameModuleInitializationPhase_1, unitArchetypes_1, unitTemplates_1, resources_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceUnits = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            resources_1.setBaseUrl(baseUrl);
            var loader = new PIXI.Loader(baseUrl);
            loader.add("units", "./img/sprites/units.json");
            return new Promise(function (resolve) {
                loader.load(function () {
                    resolve();
                });
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(unitTemplates_1.unitTemplates, "Units");
            moduleData.copyTemplates(unitArchetypes_1.unitArchetypes, "UnitArchetypes");
            return moduleData;
        },
    };
});
define("modules/space/units/templates/battleCruiser", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.battleCruiser = {
        type: "battleCruiser",
        displayName: "Battlecruiser",
        description: "Strong combat ship with low speed",
        archetype: unitArchetypes.combat,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "battleCruiser.png"),
        isSquadron: true,
        buildCost: 200,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "bc"),
        maxHealthLevel: 1,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.8,
            defence: 0.8,
            intelligence: 0.7,
            speed: 0.6,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.beamAttack,
                    abilities_1.standBy,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 2,
            _a),
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.common,
                distributionGroups_1.distributionGroups.rare,
                distributionGroups_1.distributionGroups.unique,
            ],
        },
    };
});
define("modules/space/units/templates/bomberSquadron", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bomberSquadron = {
        type: "bomberSquadron",
        displayName: "Bomber Squadron",
        description: "Can damage multiple targets with special bomb attack",
        archetype: unitArchetypes.combat,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "bomber.png"),
        isSquadron: true,
        buildCost: 200,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "fb"),
        maxHealthLevel: 0.5,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.7,
            defence: 0.4,
            intelligence: 0.5,
            speed: 0.8,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.bombAttack,
                    abilities_1.standBy,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 1,
            _a),
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.common,
                distributionGroups_1.distributionGroups.rare,
            ],
        },
    };
});
define("modules/space/units/templates/commandShip", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/passiveskills/passiveSkills", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, passiveSkills_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.commandShip = {
        type: "commandShip",
        displayName: "Command Ship",
        description: "todo",
        archetype: unitArchetypes.utility,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "shieldBoat.png"),
        isSquadron: false,
        buildCost: 300,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "sh"),
        maxHealthLevel: 0.7,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.5,
            defence: 0.6,
            intelligence: 0.7,
            speed: 0.6,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.standBy,
                ],
            },
        ],
        possiblePassiveSkills: [
            {
                flatProbability: 1,
                probabilityItems: [
                    passiveSkills_1.initialGuard,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 1,
            _a),
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.rare,
                distributionGroups_1.distributionGroups.unique,
            ],
        },
    };
});
define("modules/space/units/templates/debugShip", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/passiveskills/passiveSkills", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, passiveSkills_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.debugShip = {
        type: "debugShip",
        displayName: "Debug Ship",
        description: "debug",
        archetype: unitArchetypes.combat,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "debugShip.png"),
        isSquadron: false,
        buildCost: 0,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "f"),
        maxHealthLevel: 1,
        maxMovePoints: 999,
        maxOffensiveBattlesPerTurn: 999,
        visionRange: 999,
        detectionRange: 999,
        attributeLevels: {
            attack: 9,
            defence: 9,
            intelligence: 9,
            speed: 9,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.debugAbility,
                    abilities_1.rangedAttack,
                    abilities_1.bombAttack,
                    abilities_1.standBy,
                ],
            },
            {
                flatProbability: 1,
                probabilityItems: [
                    {
                        weight: 0.33,
                        probabilityItems: [abilities_1.bombAttack],
                    },
                    {
                        weight: 0.33,
                        probabilityItems: [abilities_1.boardingHook],
                    },
                    {
                        weight: 0.33,
                        probabilityItems: [abilities_1.guardRow],
                    },
                ],
            },
            {
                flatProbability: 1,
                probabilityItems: [
                    { weight: 0.25, probabilityItems: [abilities_1.snipeAttack] },
                    { weight: 0.25, probabilityItems: [abilities_1.snipeDefence] },
                    { weight: 0.25, probabilityItems: [abilities_1.snipeIntelligence] },
                    { weight: 0.25, probabilityItems: [abilities_1.snipeSpeed] },
                ],
            },
        ],
        possiblePassiveSkills: [
            {
                flatProbability: 1,
                probabilityItems: [
                    {
                        weight: 0.33,
                        probabilityItems: [passiveSkills_1.autoHeal],
                    },
                    {
                        weight: 0.33,
                        probabilityItems: [passiveSkills_1.warpJammer],
                    },
                    {
                        weight: 0.33,
                        probabilityItems: [passiveSkills_1.medic],
                    },
                ],
            },
        ],
        possibleLearnableAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [abilities_1.guardRow, abilities_1.closeAttack],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 1,
            _a),
        distributionData: {
            weight: 0,
            distributionGroups: [distributionGroups_1.distributionGroups.debugModeOnly],
        },
    };
});
define("modules/space/units/templates/fighterSquadron", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fighterSquadron = {
        type: "fighterSquadron",
        displayName: "Fighter Squadron",
        description: "Fast and cheap unit with good attack and speed but low defence",
        archetype: unitArchetypes.combat,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "fighter.png"),
        isSquadron: true,
        buildCost: 100,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "fa"),
        maxHealthLevel: 0.7,
        maxMovePoints: 2,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.8,
            defence: 0.6,
            intelligence: 0.4,
            speed: 1,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.closeAttack,
                    abilities_1.standBy,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 3,
            _a[itemSlot_1.itemSlot.high] = 2,
            _a),
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.common,
                distributionGroups_1.distributionGroups.rare,
            ],
        },
    };
});
define("modules/space/units/templates/scout", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.scout = {
        type: "scout",
        displayName: "Scout",
        description: "Weak in combat, but has high vision and can reveal stealthy units and details of units in same star",
        archetype: unitArchetypes.scouting,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "scout.png"),
        isSquadron: true,
        buildCost: 200,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "sc"),
        maxHealthLevel: 0.6,
        maxMovePoints: 2,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 2,
        detectionRange: 0,
        attributeLevels: {
            attack: 0.5,
            defence: 0.5,
            intelligence: 0.8,
            speed: 0.7,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.standBy,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 1,
            _a),
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.common,
                distributionGroups_1.distributionGroups.rare,
            ],
        },
    };
});
define("modules/space/units/templates/shieldBoat", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/passiveskills/passiveSkills", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, passiveSkills_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shieldBoat = {
        type: "shieldBoat",
        displayName: "Shield Boat",
        description: "Great defence and ability to protect allies in same row",
        archetype: unitArchetypes.defence,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "shieldBoat.png"),
        isSquadron: true,
        buildCost: 200,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "sh"),
        maxHealthLevel: 0.9,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.5,
            defence: 0.9,
            intelligence: 0.6,
            speed: 0.4,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.guardRow,
                    abilities_1.standBy,
                ],
            },
        ],
        possiblePassiveSkills: [
            {
                flatProbability: 1,
                probabilityItems: [
                    passiveSkills_1.initialGuard,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 1,
            _a),
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.common,
                distributionGroups_1.distributionGroups.rare,
                distributionGroups_1.distributionGroups.unique,
            ],
        },
    };
});
define("modules/space/units/templates/stealthShip", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/space/items/itemSlot", "modules/space/technologies/technologyTemplates", "modules/space/units/resources"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, abilities_1, distributionGroups_1, itemSlot_1, technologies, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stealthShip = {
        type: "stealthShip",
        displayName: "Stealth Ship",
        description: "Weak ship that is undetectable by regular vision",
        archetype: unitArchetypes.scouting,
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "scout.png"),
        isSquadron: true,
        buildCost: 500,
        kind: "unit",
        getIconSrc: resources_1.getIconSrc.bind(null, "sc"),
        maxHealthLevel: 0.6,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        isStealthy: true,
        attributeLevels: {
            attack: 0.5,
            defence: 0.5,
            intelligence: 0.8,
            speed: 0.7,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    abilities_1.rangedAttack,
                    abilities_1.standBy,
                ],
            },
        ],
        itemSlots: (_a = {},
            _a[itemSlot_1.itemSlot.low] = 1,
            _a[itemSlot_1.itemSlot.mid] = 1,
            _a[itemSlot_1.itemSlot.high] = 1,
            _a),
        techRequirements: [
            {
                technology: technologies.stealth,
                level: 2,
            }
        ],
        distributionData: {
            weight: 1,
            distributionGroups: [
                distributionGroups_1.distributionGroups.rare,
                distributionGroups_1.distributionGroups.unique,
            ],
        },
    };
});
define("modules/space/units/unitTemplates", ["require", "exports", "modules/space/units/templates/battleCruiser", "modules/space/units/templates/bomberSquadron", "modules/space/units/templates/commandShip", "modules/space/units/templates/debugShip", "modules/space/units/templates/fighterSquadron", "modules/space/units/templates/scout", "modules/space/units/templates/shieldBoat", "modules/space/units/templates/stealthShip"], function (require, exports, battleCruiser_1, bomberSquadron_1, commandShip_1, debugShip_1, fighterSquadron_1, scout_1, shieldBoat_1, stealthShip_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitTemplates = (_a = {},
        _a[battleCruiser_1.battleCruiser.type] = battleCruiser_1.battleCruiser,
        _a[commandShip_1.commandShip.type] = commandShip_1.commandShip,
        _a[stealthShip_1.stealthShip.type] = stealthShip_1.stealthShip,
        _a[debugShip_1.debugShip.type] = debugShip_1.debugShip,
        _a[scout_1.scout.type] = scout_1.scout,
        _a[bomberSquadron_1.bomberSquadron.type] = bomberSquadron_1.bomberSquadron,
        _a[fighterSquadron_1.fighterSquadron.type] = fighterSquadron_1.fighterSquadron,
        _a[shieldBoat_1.shieldBoat.type] = shieldBoat_1.shieldBoat,
        _a);
});
//# sourceMappingURL=index.js.map