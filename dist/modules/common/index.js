define("modules/common/distributionGroups", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.distributionGroups = {
        common: "common",
        rare: "rare",
        unique: "unique",
        debugModeOnly: "debugModeOnly",
    };
});
define("modules/common/generateIndependentFleets", ["require", "exports", "src/Fleet", "src/Name", "src/Unit", "src/templateinterfaces/Distributable", "modules/common/distributionGroups"], function (require, exports, Fleet_1, Name_1, Unit_1, Distributable_1, distributionGroups_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unitRoleData = {
        normal: {
            namePrefix: "",
            health: 1,
            attributes: 1,
            filterCandidates: function (candidates) {
                return Distributable_1.getDistributablesWithGroups(candidates, [distributionGroups_1.distributionGroups.common]);
            },
        },
        elite: {
            namePrefix: "",
            health: 1.2,
            attributes: 1.2,
            filterCandidates: function (candidates) {
                return Distributable_1.getDistributablesWithGroups(candidates, [distributionGroups_1.distributionGroups.rare]);
            },
        },
        leader: {
            namePrefix: "",
            health: 1.35,
            attributes: 1.35,
            filterCandidates: function (candidates) {
                return Distributable_1.getDistributablesWithGroups(candidates, [distributionGroups_1.distributionGroups.unique]);
            },
        },
    };
    function generateIndependentFleets(race, player, location, globalStrength, localStrength, maxUnitsPerSideInBattle) {
        var locationShouldHaveLeader = localStrength > 0.8;
        var allBuildableUnitTypes = race.getBuildableUnits();
        var unitCountFromGlobalStrength = maxUnitsPerSideInBattle * 0.34 + maxUnitsPerSideInBattle * 0.66 * globalStrength;
        var unitCountFromLocalStrength = locationShouldHaveLeader ? 1 : 0;
        var unitCount = Math.min(Math.round(unitCountFromGlobalStrength + unitCountFromLocalStrength), maxUnitsPerSideInBattle);
        var eliteCount = Math.ceil((unitCount / maxUnitsPerSideInBattle - 0.499) * 3);
        var units = [];
        for (var i = 0; i < unitCount; i++) {
            var unitRole = void 0;
            if (locationShouldHaveLeader && i === 0) {
                unitRole = "leader";
            }
            else if (i < eliteCount) {
                unitRole = "elite";
            }
            else {
                unitRole = "normal";
            }
            var candidateUnitTemplates = unitRoleData[unitRole].filterCandidates(allBuildableUnitTypes);
            var unitTemplate = Distributable_1.getRandomWeightedDistributable(candidateUnitTemplates);
            var healthModifier = unitRoleData[unitRole].health;
            var attributesModifier = unitRoleData[unitRole].attributes;
            var unitName = "" + unitRoleData[unitRole].namePrefix + race.getUnitName(unitTemplate);
            var unit = Unit_1.Unit.fromTemplate({
                template: unitTemplate,
                race: race,
                name: unitName,
                attributeMultiplier: (1 + globalStrength * 0.2) * attributesModifier,
                healthMultiplier: (1 + globalStrength) * healthModifier,
            });
            units.push(unit);
            player.addUnit(unit);
        }
        var fleets = Fleet_1.Fleet.createFleetsFromUnits(units);
        fleets.forEach(function (fleet) {
            player.addFleet(fleet);
            location.addFleet(fleet);
            fleet.name = new Name_1.Name("Independent " + race.displayName + " Fleet", false);
        });
        return fleets;
    }
    exports.generateIndependentFleets = generateIndependentFleets;
});
define("modules/common/generateIndependentPlayer", ["require", "exports", "src/Name", "src/Player"], function (require, exports, Name_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function generateIndependentPlayer(race) {
        var player = new Player_1.Player({
            isAi: true,
            isIndependent: true,
            race: race,
            money: -1,
            name: new Name_1.Name("Independent " + race.displayName, race.displayName.isPlural),
        });
        player.colorAlpha = 0.66;
        return player;
    }
    exports.generateIndependentPlayer = generateIndependentPlayer;
});
define("modules/common/unitArchetypes", ["require", "exports"], function (require, exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.combat = {
        type: "combat",
        idealWeightInBattle: 1,
        idealWeightInFleet: 1,
        rowScores: {
            ROW_FRONT: 1,
            ROW_BACK: 0.6,
        },
    };
    exports.utility = {
        type: "utility",
        idealWeightInBattle: 0.33,
        idealWeightInFleet: 0.5,
        rowScores: {
            ROW_FRONT: 0.4,
            ROW_BACK: 0.6,
        },
    };
    exports.scouting = {
        type: "scouting",
        idealWeightInBattle: 0.01,
        idealWeightInFleet: 0.2,
        rowScores: {
            ROW_FRONT: 0.01,
            ROW_BACK: 0.02,
        },
    };
    exports.defence = {
        type: "defence",
        idealWeightInBattle: 0.5,
        idealWeightInFleet: 0.5,
        rowScores: {
            ROW_FRONT: 1,
            ROW_BACK: 0.5,
        },
        scoreMultiplierForRowFN: function (row, rowUnits, enemyUnits, enemyFormation) {
            var multiplier = (row === "ROW_BACK" ? 0.7 : 1);
            var unitDefenceThreshhold = 6;
            var totalDefenceUnderThreshhold = rowUnits.filter(function (unit) { return Boolean(unit); }).map(function (unit) {
                var defenceUnderThreshhold = Math.max(unit.attributes.defence - unitDefenceThreshhold);
                return defenceUnderThreshhold;
            }).reduce(function (total, current) {
                return total + current;
            }, 0);
            return multiplier + totalDefenceUnderThreshhold * 0.2;
        },
    };
    exports.unitArchetypes = (_a = {},
        _a[exports.combat.type] = exports.combat,
        _a[exports.utility.type] = exports.utility,
        _a[exports.scouting.type] = exports.scouting,
        _a[exports.defence.type] = exports.defence,
        _a);
});
//# sourceMappingURL=index.js.map