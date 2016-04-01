/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../templateinterfaces/iresourcetemplate.d.ts" />
/// <reference path="../templateinterfaces/idistributable.d.ts" />
/// <reference path="../templateinterfaces/ibuildingtemplate.d.ts" />
/// <reference path="../savedata/ibuildingsavedata.d.ts" />
/// <reference path="../templateinterfaces/imanufacturablething.d.ts" />
/// <reference path="../savedata/imanufactorysavedata.d.ts" />
/// <reference path="../ifleetattacktarget.d.ts" />
/// <reference path="../savedata/istarsavedata.d.ts" />
/// <reference path="../templateinterfaces/istatuseffecttemplate.d.ts" />
/// <reference path="../savedata/ifleetsavedata.d.ts" />
/// <reference path="../../lib/husl.d.ts" />
/// <reference path="../../lib/rng.d.ts" />
/// <reference path="../templateinterfaces/isubemblemtemplate.d.ts" />
/// <reference path="../savedata/iemblemsavedata.d.ts" />
/// <reference path="../savedata/iflagsavedata.d.ts" />
/// <reference path="../templateinterfaces/iitemtemplate.d.ts" />
/// <reference path="../savedata/iitemsavedata.d.ts" />
/// <reference path="../templateinterfaces/iabilitytemplate.d.ts" />
/// <reference path="../ibattledata.d.ts" />
/// <reference path="../templateinterfaces/iattitudemodifiertemplate.d.ts" />
/// <reference path="../savedata/iattitudemodifiersavedata.d.ts" />
/// <reference path="../savedata/idiplomacystatussavedata.d.ts" />
/// <reference path="../savedata/iplayertechnologysavedata.d.ts" />
/// <reference path="../../lib/voronoi.d.ts" />
/// <reference path="../../lib/quadtree.d.ts" />
/// <reference path="../templateinterfaces/inotificationtemplate.d.ts" />
/// <reference path="../savedata/inotificationsavedata.d.ts" />
/// <reference path="../savedata/igamesavedata.d.ts" />
/// <reference path="../savedata/igalaxymapsavedata.d.ts" />
/// <reference path="../savedata/iplayersavedata.d.ts" />
/// <reference path="../templateinterfaces/iunittemplate.d.ts" />
/// <reference path="../iunitattributes.d.ts" />
/// <reference path="../savedata/iunitsavedata.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../../lib/react-global-0.13.3.d.ts" />
/// <reference path="../../lib/react-0.13.3.d.ts" />
/// <reference path="../templateinterfaces/itechnologytemplate.d.ts" />
/// <reference path="../templateinterfaces/imaprendererlayertemplate.d.ts" />
/// <reference path="../templateinterfaces/imaprenderermapmodetemplate.d.ts" />
/// <reference path="../../lib/offset.d.ts" />
/// <reference path="../tutorials/tutorial.d.ts" />
/// <reference path="../templateinterfaces/mapgenoptions.d.ts" />
/// <reference path="../templateinterfaces/imapgentemplate.d.ts" />
/// <reference path="../templateinterfaces/iunitfamily.d.ts" />
/// <reference path="../templateinterfaces/ieffectactiontemplate.d.ts" />
/// <reference path="../../lib/proton.d.ts" />
/// <reference path="../templateinterfaces/ibattlesfxtemplate.d.ts" />
/// <reference path="../templateinterfaces/sfxparams.d.ts" />
/// <reference path="../templateinterfaces/iabilityeffecttemplate.d.ts" />
/// <reference path="../templateinterfaces/idefencebuildingtemplate.d.ts" />
/// <reference path="../templateinterfaces/iculturetemplate.d.ts" />
/// <reference path="../templateinterfaces/ipassiveskilltemplate.d.ts" />
/// <reference path="../templateinterfaces/ibattleprepeffect.d.ts" />
/// <reference path="../templateinterfaces/iturnstarteffect.d.ts" />
/// <reference path="../templateinterfaces/istatuseffectattributeadjustment.d.ts" />
/// <reference path="../templateinterfaces/istatuseffectattributes.d.ts" />
/// <reference path="../templateinterfaces/iunitarchetype.d.ts" />
/// <reference path="../templateinterfaces/iunitdrawingfunction.d.ts" />
/// <reference path="../templateinterfaces/ispritetemplate.d.ts" />
/// <reference path="../templateinterfaces/iobjectivetemplate.d.ts" />
/// <reference path="../savedata/inotificationlogsavedata.d.ts" />
declare class EventEmitter3 extends PIXI.EventEmitter {
}
declare namespace Rance {
    var eventEmitter: EventEmitter3;
    var eventManager: {
        dispatchEvent: any;
        removeEventListener: any;
        removeAllListeners: any;
        addEventListener: (eventType: string, listener: Function) => Function;
    };
}
declare namespace Rance {
    enum RandomGenUnitRarity {
        common = 0,
        elite = 1,
        commander = 2,
    }
}
declare namespace Rance {
    enum DamageType {
        physical = 0,
        magical = 1,
    }
}
declare namespace Rance {
    function randInt(min: number, max: number): number;
    function randRange(min: number, max: number): number;
    function getRandomArrayKey(target: any[]): number;
    function getRandomArrayItem(target: any[]): any;
    function getSeededRandomArrayItem(array: any[], rng: any): any;
    function getRandomKey(target: {
        [props: string]: any;
    }): string;
    function getObjectKeysSortedByValue(obj: {
        [key: string]: number;
    }, order: string): string[];
    function getObjectKeysSortedByValueOfProp(obj: {
        [key: string]: any;
    }, prop: string, order: string): string[];
    function sortObjectsByProperty(objects: {
        [key: string]: any;
    }[], prop: string, order: string): {
        [key: string]: any;
    }[];
    function getRandomProperty(target: {
        [props: string]: any;
    }): any;
    function getAllPropertiesWithKey(target: {
        [props: string]: any;
    }, keyToFind: string): any[];
    function getRandomPropertyWithKey(target: {
        [props: string]: any;
    }, keyToFind: string): any;
    function getRandomKeyWithWeights(target: {
        [prop: string]: number;
    }): string;
    function getRandomArrayItemWithWeights<T extends {
        weight?: number;
    }>(arr: T[]): T;
    function findItemWithKey<T>(source: {
        [key: string]: any;
    }, keyToFind: string, parentKey?: string, hasParentKey?: boolean): T;
    function getFrom2dArray(target: any[][], arr: number[][]): any[];
    function flatten2dArray(toFlatten: any[][]): any[];
    function reverseSide(side: UnitBattleSide): UnitBattleSide;
    function sortByManufactoryCapacityFN(a: Star, b: Star): number;
    function rectContains(rect: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }, point: Point): boolean;
    function hexToString(hex: number): string;
    function stringToHex(text: string): number;
    function colorImageInPlayerColor(image: HTMLImageElement, player: Player): string;
    function extendObject(from: any, to?: any, onlyExtendAlreadyPresent?: boolean): any;
    function deepMerge(target: any, src: any, excludeKeysNotInTarget?: boolean): any;
    function deletePropertiesNotSharedWithTarget(source: {
        [key: string]: any;
    }, target: {
        [key: string]: any;
    }): any;
    function recursiveRemoveAttribute(parent: HTMLElement, attribute: string): void;
    function clamp(value: number, min: number, max: number): number;
    function roundToNearestMultiple(value: number, multiple: number): number;
    function getAngleBetweenDegrees(degA: number, degB: number): number;
    function prettifyDate(date: Date): string;
    function getMatchingLocalstorageItemsByDate(stringToMatch: string): any[];
    function shuffleArray(toShuffle: any[], seed?: any): any[];
    function getRelativeValue(value: number, min: number, max: number, inverse?: boolean): number;
    function getRelativeWeightsFromObject(byCount: {
        [prop: string]: number;
    }, inverse?: boolean): {
        [prop: string]: number;
    };
    function getDropTargetAtLocation(x: number, y: number): HTMLElement;
    function onDOMLoaded(onLoaded: () => void): void;
    function meetAllPlayers(): void;
    function getItemsFromWeightedProbabilities<T>(probabilities: WeightedProbability<T>[]): T[];
    function defaultNameGenerator(unit: Unit): string;
    function transformMat3(a: Point, m: number[]): {
        x: number;
        y: number;
    };
    function createDummySpriteForShader(x?: number, y?: number, width?: number, height?: number): PIXI.Sprite;
    function getDummyTextureForShader(): PIXI.Texture;
    function findEasingFunctionHighPoint(easingFunction: (x: number) => number, resolution?: number, maxIterations?: number, startIndex?: number, endIndex?: number, iteration?: number): number;
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Resources {
                    var testResource1: ResourceTemplate;
                    var testResource2: ResourceTemplate;
                    var testResource3: ResourceTemplate;
                    var testResource4: ResourceTemplate;
                    var testResource5: ResourceTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    interface Point {
        x: number;
        y: number;
    }
}
declare namespace Rance {
    interface IBuildingUpgradeData {
        template: BuildingTemplate;
        level: number;
        cost: number;
        parentBuilding: Building;
    }
    class Building {
        template: BuildingTemplate;
        id: number;
        location: Star;
        controller: Player;
        upgradeLevel: number;
        totalCost: number;
        constructor(props: {
            template: BuildingTemplate;
            location: Star;
            controller?: Player;
            upgradeLevel?: number;
            totalCost?: number;
            id?: number;
        });
        getEffect(effect?: BuildingEffect): {};
        getPossibleUpgrades(): IBuildingUpgradeData[];
        upgrade(): void;
        setController(newController: Player): void;
        serialize(): IBuildingSaveData;
    }
}
declare namespace Rance {
    interface IManufacturableThingWithType {
        type: string;
        template: IManufacturableThing;
    }
    class Manufactory {
        buildQueue: IManufacturableThingWithType[];
        player: Player;
        star: Star;
        capacity: number;
        maxCapacity: number;
        unitStatsModifier: number;
        unitHealthModifier: number;
        constructor(star: Star, serializedData?: any);
        makeFromData(data: any): void;
        queueIsFull(): boolean;
        addThingToQueue(template: IManufacturableThing, type: string): void;
        removeThingAtIndex(index: number): void;
        buildAllThings(): void;
        getLocalUnitTypes(): {
            manufacturable: UnitTemplate[];
            potential: UnitTemplate[];
        };
        getLocalItemTypes(): {
            manufacturable: ItemTemplate[];
            potential: ItemTemplate[];
        };
        getManufacturableThingsForType(type: string): IManufacturableThing[];
        canManufactureThing(template: IManufacturableThing, type: string): boolean;
        handleOwnerChange(): void;
        getCapacityUpgradeCost(): number;
        upgradeCapacity(amount: number): void;
        getUnitUpgradeCost(): number;
        upgradeUnitStatsModifier(amount: number): void;
        upgradeUnitHealthModifier(amount: number): void;
        serialize(): IManufactorySaveData;
    }
}
declare namespace Rance {
    class Star implements Point {
        id: number;
        x: number;
        y: number;
        basisX: number;
        basisY: number;
        linksTo: Star[];
        linksFrom: Star[];
        mapGenData: any;
        voronoiId: number;
        seed: string;
        name: string;
        owner: Player;
        baseIncome: number;
        resource: ResourceTemplate;
        fleets: {
            [playerId: string]: Fleet[];
        };
        buildings: {
            [category: string]: Building[];
        };
        buildingsEffect: BuildingEffect;
        buildingsEffectIsDirty: boolean;
        voronoiCell: any;
        indexedNeighborsInRange: {
            [range: number]: {
                all: Star[];
                byRange: {
                    [range: number]: Star[];
                };
            };
        };
        indexedDistanceToStar: {
            [id: number]: number;
        };
        buildableUnitTypes: UnitTemplate[];
        manufactory: Manufactory;
        constructor(x: number, y: number, id?: number);
        addBuilding(building: Building): void;
        removeBuilding(building: Building): void;
        sortDefenceBuildings(): void;
        getSecondaryController(): Player;
        updateController(): void;
        updateBuildingsEffect(): void;
        getBuildingsEffect(): BuildingEffect;
        getEffectWithBuildingsEffect(base: number, effectType: string): any;
        getIncome(): any;
        getResourceIncome(): {
            resource: ResourceTemplate;
            amount: any;
        };
        getResearchPoints(): any;
        getAllBuildings(): Building[];
        getBuildingsForPlayer(player: Player): Building[];
        getBuildingsByFamily(buildingTemplate: BuildingTemplate): Building[];
        getBuildableBuildings(): BuildingTemplate[];
        getBuildingUpgrades(): {
            [buildingId: number]: {
                template: BuildingTemplate;
                level: number;
                cost: number;
                parentBuilding: Building;
            }[];
        };
        getAllFleets(): Fleet[];
        getFleetIndex(fleet: Fleet): number;
        hasFleet(fleet: Fleet): boolean;
        addFleet(fleet: Fleet): boolean;
        addFleets(fleets: Fleet[]): void;
        removeFleet(fleet: Fleet): boolean;
        removeFleets(fleets: Fleet[]): void;
        getAllUnitsOfPlayer(player: Player): Unit[];
        getAllUnits(): Unit[];
        getIndependentUnits(): Unit[];
        getTargetsForPlayer(player: Player): IFleetAttackTarget[];
        getFirstEnemyDefenceBuilding(player: Player): Building;
        getEnemyFleetOwners(player: Player, excludedTarget?: Player): Player[];
        setPosition(x: number, y: number): void;
        setResource(resource: ResourceTemplate): void;
        hasLink(linkTo: Star): boolean;
        addLink(linkTo: Star): void;
        removeLink(linkTo: Star, removeOpposite?: boolean): void;
        getAllLinks(): Star[];
        getEdgeWith(neighbor: Star): any;
        getSharedNeighborsWith(neighbor: Star): Star[];
        getNeighbors(): Star[];
        getLinkedInRange(range: number): {
            all: Star[];
            byRange: {
                [range: number]: Star[];
            };
        };
        getIslandForQualifier(qualifier: (starA: Star, starB: Star) => boolean, earlyReturnSize?: number): Star[];
        getNearestStarForQualifier(qualifier: (star: Star) => boolean): Star;
        getDistanceToStar(target: Star): number;
        getVisionRange(): number;
        getVision(): Star[];
        getDetectionRange(): number;
        getDetection(): Star[];
        getHealingFactor(player: Player): number;
        getPresentPlayersByVisibility(): {
            visible: {
                [playerId: number]: Player;
            };
            detected: {
                [playerId: number]: Player;
            };
            all: {
                [playerId: number]: Player;
            };
        };
        getSeed(): string;
        buildManufactory(): void;
        serialize(): IStarSaveData;
    }
}
declare namespace Rance {
    class PriorityQueue {
        items: {
            [priority: number]: any[];
        };
        constructor();
        isEmpty(): boolean;
        push(priority: number, data: any): void;
        pop(): any;
        peek(): any[];
    }
}
declare namespace Rance {
    function backTrace(graph: any, target: Star): {
        star: Star;
        cost: any;
    }[];
    function aStar(start: Star, target: Star): {
        came: any;
        cost: any;
        queue: PriorityQueue;
    };
}
declare namespace Rance {
    class StatusEffect {
        template: StatusEffectTemplate;
        duration: number;
        constructor(template: StatusEffectTemplate, duration: number);
        processTurnEnd(): void;
        clone(): StatusEffect;
    }
}
declare namespace Rance {
    class Fleet {
        player: Player;
        units: Unit[];
        location: Star;
        visionIsDirty: boolean;
        visibleStars: Star[];
        detectedStars: Star[];
        isStealthy: boolean;
        id: number;
        name: string;
        constructor(player: Player, units: Unit[], location: Star, id?: number, shouldRender?: boolean);
        getUnitIndex(unit: Unit): number;
        hasUnit(unit: Unit): boolean;
        deleteFleet(shouldRender?: boolean): void;
        mergeWith(fleet: Fleet, shouldRender?: boolean): void;
        addUnit(unit: Unit): boolean;
        addUnits(units: Unit[]): void;
        removeUnit(unit: Unit): boolean;
        removeUnits(units: Unit[]): void;
        transferUnit(fleet: Fleet, unit: Unit): boolean;
        split(): Fleet;
        splitStealthyUnits(): Fleet;
        getMinCurrentMovePoints(): number;
        getMinMaxMovePoints(): number;
        canMove(): boolean;
        subtractMovePoints(): void;
        move(newLocation: Star): void;
        getPathTo(newLocation: Star): {
            star: Star;
            cost: any;
        }[];
        pathFind(newLocation: Star, onMove?: any, afterMove?: any): void;
        getFriendlyFleetsAtOwnLocation(): Fleet[];
        getTotalStrengthEvaluation(): number;
        getTotalHealth(): {
            current: number;
            max: number;
        };
        updateVisibleStars(): void;
        getVision(): Star[];
        getDetection(): Star[];
        serialize(): IFleetSaveData;
    }
}
declare namespace Rance {
    interface IRange {
        min?: number;
        max?: number;
        step?: number;
        defaultValue?: number;
    }
}
declare namespace Rance {
    function hex2rgb(hex: number): number[];
    function rgb2hex(rgb: number[]): number;
    function hsvToRgb(h: number, s: number, v: number): number[];
    function hslToRgb(h: number, s: number, l: number): number[];
    function rgbToHsv(r: number, g: number, b: number): number[];
    function rgbToHsl(r: number, g: number, b: number): number[];
    function hslToHex(h: number, s: number, l: number): number;
    function hsvToHex(h: number, s: number, v: number): number;
    function hexToHsl(hex: number): number[];
    function hexToHsv(hex: number): number[];
    function excludeFromRanges(ranges: IRange[], toExclude: IRange): IRange[];
    function getIntersectingRanges(ranges: IRange[], toIntersectWith: IRange): IRange[];
    function excludeFromRange(range: IRange, toExclude: IRange): IRange[];
    function randomSelectFromRanges(ranges: IRange[]): number;
    function makeRandomVibrantColor(): number[];
    function makeRandomDeepColor(): number[];
    function makeRandomLightColor(): number[];
    function makeRandomColor(values?: {
        h?: IRange[];
        s?: IRange[];
        l?: IRange[];
    }): number[];
    function colorFromScalars(color: number[]): number[];
    function scalarsFromColor(scalars: number[]): number[];
    function makeContrastingColor(props: {
        color: number[];
        initialRanges?: {
            h?: IRange;
            s?: IRange;
            l?: IRange;
        };
        minDifference?: {
            h?: number;
            s?: number;
            l?: number;
        };
        maxDifference?: {
            h?: number;
            s?: number;
            l?: number;
        };
    }): number[];
    function hexToHusl(hex: number): number[];
    function generateMainColor(): number;
    function generateSecondaryColor(mainColor: number): number;
    function generateColorScheme(mainColor?: number): {
        main: number;
        secondary: number;
    };
    function checkRandomGenHues(amt: number): void;
}
declare namespace Rance {
    enum SubEmblemCoverage {
        inner = 0,
        outer = 1,
        both = 2,
    }
    enum SubEmblemPosition {
        foreground = 0,
        background = 1,
        both = 2,
    }
    class Emblem {
        alpha: number;
        color: number;
        inner: SubEmblemTemplate;
        outer: SubEmblemTemplate;
        constructor(color: number, alpha?: number, inner?: SubEmblemTemplate, outer?: SubEmblemTemplate);
        generateRandom(minAlpha: number, rng?: any): void;
        canAddOuterTemplate(): boolean;
        getPossibleSubEmblemsToAdd(): SubEmblemTemplate[];
        generateSubEmblems(rng: any): void;
        canAddBackground(): boolean;
        drawSubEmblem(toDraw: SubEmblemTemplate, maxWidth: number, maxHeight: number, stretch: boolean): HTMLCanvasElement;
        draw(maxWidth: number, maxHeight: number, stretch: boolean): HTMLCanvasElement;
        serialize(): IEmblemSaveData;
    }
}
declare namespace Rance {
    class Flag {
        seed: any;
        width: number;
        height: number;
        mainColor: number;
        secondaryColor: number;
        tetriaryColor: number;
        backgroundEmblem: Emblem;
        foregroundEmblem: Emblem;
        private _renderedSvg;
        customImage: string;
        private _customImageToRender;
        cachedCanvases: {
            [sizeString: string]: HTMLCanvasElement;
        };
        constructor(props: {
            width: number;
            height?: number;
            mainColor?: number;
            secondaryColor?: number;
            tetriaryColor?: number;
        });
        setColorScheme(main: number, secondary?: number, tetriary?: number): void;
        generateRandom(seed?: any): void;
        clearContent(): void;
        setForegroundEmblem(emblem: Emblem): void;
        setBackgroundEmblem(emblem: Emblem): void;
        setCustomImage(imageSrc: string): void;
        getCanvas(width: number, height: number, stretch?: boolean, useCache?: boolean): HTMLCanvasElement;
        draw(width?: number, height?: number, stretch?: boolean): HTMLCanvasElement;
        serialize(): IFlagSaveData;
    }
}
declare namespace Rance {
    class Item {
        id: number;
        template: ItemTemplate;
        unit: Unit;
        constructor(template: ItemTemplate, id?: number);
        serialize(): IItemSaveData;
    }
}
declare namespace Rance {
    interface IMove {
        ability: AbilityTemplate;
        targetId: number;
    }
    class MCTreeNode {
        battle: Battle;
        sideId: string;
        isBetweenAI: boolean;
        move: IMove;
        depth: number;
        parent: MCTreeNode;
        children: MCTreeNode[];
        visits: number;
        wins: number;
        winRate: number;
        totalScore: number;
        averageScore: number;
        currentScore: number;
        possibleMoves: IMove[];
        uctEvaluation: number;
        uctIsDirty: boolean;
        constructor(battle: Battle, move?: IMove);
        getPossibleMoves(): IMove[];
        addChild(possibleMovesIndex?: number): MCTreeNode;
        getChildForMove(move: IMove): MCTreeNode;
        updateResult(result: number): void;
        pickRandomAbilityAndTarget(actions: {
            [targetId: number]: AbilityTemplate[];
        }): {
            targetId: number;
            abilityType: string;
        };
        simulateOnce(battle: Battle): void;
        simulateToEnd(): void;
        clearResult(): void;
        getCombinedScore(): number;
        setUct(): void;
        getHighestUctChild(): MCTreeNode;
        getRecursiveBestUctChild(): MCTreeNode;
    }
}
declare namespace Rance {
    class MCTree {
        rootNode: MCTreeNode;
        actualBattle: Battle;
        sideId: string;
        countVisitsAsIterations: boolean;
        constructor(battle: Battle, sideId: string, fastMode?: boolean);
        sortByWinRateFN(a: MCTreeNode, b: MCTreeNode): number;
        sortByCombinedScoreFN(a: MCTreeNode, b: MCTreeNode): number;
        evaluate(iterations: number): MCTreeNode;
        getChildForMove(move: IMove): MCTreeNode;
        rootSimulationNeedsToBeRemade(): boolean;
        remakeSimulation(): MCTreeNode;
        advanceMove(move: IMove): void;
        getBestMoveAndAdvance(iterations: number): IMove;
        printToConsole(nodes: MCTreeNode[]): void;
    }
}
declare namespace Rance {
    class BattleSimulator {
        battle: Battle;
        tree: MCTree;
        hasEnded: boolean;
        constructor(battle: Battle);
        simulateBattle(): void;
        simulateMove(): void;
        simulateAbility(ability: AbilityTemplate, target: Unit): void;
        getBattleEndData(): void;
        finishBattle(): void;
    }
}
declare namespace Rance {
    class BattlePrep {
        attacker: Player;
        defender: Player;
        battleData: IBattleData;
        attackerFormation: Unit[][];
        defenderFormation: Unit[][];
        attackerUnits: Unit[];
        defenderUnits: Unit[];
        availableUnits: Unit[];
        enemyUnits: Unit[];
        playerFormation: Unit[][];
        humanPlayer: Player;
        enemyFormation: Unit[][];
        enemyPlayer: Player;
        alreadyPlaced: {
            [id: number]: number[];
        };
        minDefendersInNeutralTerritory: number;
        afterBattleFinishCallbacks: Function[];
        constructor(battleData: IBattleData);
        resetBattleStats(): void;
        triggerPassiveSkills(): void;
        makeEmptyFormation(): Unit[][];
        makeAIFormations(): void;
        setupPlayer(): void;
        makeAutoFormation(units: Unit[], enemyUnits: Unit[], player: Player): Unit[][];
        getUnitPosition(unit: Unit): number[];
        getUnitAtPosition(position: number[]): Unit;
        clearPlayerFormation(): void;
        setupPlayerFormation(formation: Unit[][]): void;
        setUnit(unit: Unit, position: number[]): void;
        swapUnits(unit1: Unit, unit2: Unit): void;
        removeUnit(unit: Unit): void;
        humanFormationIsValid(): boolean;
        forEachUnitInFormation(formation: Unit[][], operator: (unit: Unit) => any): void;
        makeBattle(): Battle;
    }
}
declare namespace Rance {
    class AttitudeModifier {
        template: AttitudeModifierTemplate;
        startTurn: number;
        endTurn: number;
        currentTurn: number;
        strength: number;
        isOverRidden: boolean;
        constructor(props: {
            template: AttitudeModifierTemplate;
            startTurn: number;
            endTurn?: number;
            strength?: number;
        });
        setStrength(evaluation: IDiplomacyEvaluation): number;
        getFreshness(currentTurn?: number): number;
        refresh(newModifier: AttitudeModifier): void;
        getAdjustedStrength(currentTurn?: number): number;
        hasExpired(currentTurn?: number): boolean;
        shouldEnd(evaluation: IDiplomacyEvaluation): boolean;
        serialize(): IAttitudeModifierSaveData;
    }
}
declare namespace Rance {
    enum DiplomaticState {
        peace = 0,
        coldWar = 1,
        war = 2,
    }
    class DiplomacyStatus {
        player: Player;
        baseOpinion: number;
        metPlayers: {
            [playerId: number]: Player;
        };
        statusByPlayer: {
            [playerId: number]: DiplomaticState;
        };
        attitudeModifiersByPlayer: {
            [playerId: number]: AttitudeModifier[];
        };
        listeners: {
            [name: string]: Function[];
        };
        constructor(player: Player);
        addEventListeners(): void;
        destroy(): void;
        removePlayer(player: Player): void;
        getBaseOpinion(): number;
        updateAttitudes(): void;
        handleDiplomaticStatusUpdate(): void;
        getOpinionOf(player: Player): number;
        getUnMetPlayerCount(): number;
        meetPlayer(player: Player): void;
        canDeclareWarOn(player: Player): boolean;
        canMakePeaceWith(player: Player): boolean;
        declareWarOn(player: Player): void;
        makePeaceWith(player: Player): void;
        canAttackFleetOfPlayer(player: Player): boolean;
        canAttackBuildingOfPlayer(player: Player): boolean;
        getModifierOfSameType(player: Player, modifier: AttitudeModifier): AttitudeModifier;
        addAttitudeModifier(player: Player, modifier: AttitudeModifier): void;
        triggerAttitudeModifier(template: AttitudeModifierTemplate, player: Player, source: Player): void;
        processAttitudeModifiersForPlayer(player: Player, evaluation: IDiplomacyEvaluation): void;
        serialize(): IDiplomacyStatusSaveData;
    }
}
declare namespace Rance {
    class PlayerTechnology {
        technologies: {
            [technologyKey: string]: {
                technology: TechnologyTemplate;
                totalResearch: number;
                level: number;
                priority: number;
                priorityIsLocked: boolean;
            };
        };
        tempOverflowedResearchAmount: number;
        getResearchSpeed: () => number;
        constructor(getResearchSpeed: () => number, savedData?: {
            [key: string]: {
                totalResearch: number;
                priority: number;
                priorityIsLocked: boolean;
            };
        });
        initPriorities(): void;
        allocateResearchPoints(amount: number, iteration?: number): void;
        allocateOverflowedResearchPoints(iteration?: number): void;
        getResearchNeededForTechnologyLevel(level: number): number;
        addResearchTowardsTechnology(technology: TechnologyTemplate, amount: number): void;
        getMaxNeededPriority(technology: TechnologyTemplate): number;
        getOpenTechnologiesPriority(): number;
        getRelativeOpenTechnologyPriority(technology: TechnologyTemplate): number;
        setTechnologyPriority(technology: TechnologyTemplate, priority: number, force?: boolean): void;
        capTechnologyPrioritiesToMaxNeeded(): void;
        serialize(): IPlayerTechnologySaveData;
    }
}
declare namespace Rance {
    interface IArchetypeValues {
        [archetypeType: string]: number;
    }
    interface IPersonality {
        expansiveness: number;
        aggressiveness: number;
        friendliness: number;
        unitCompositionPreference: IArchetypeValues;
    }
    function makeRandomPersonality(): IPersonality;
}
declare namespace Rance {
    class MapVoronoiInfo {
        treeMap: any;
        diagram: any;
        nonFillerLines: {
            [visibility: string]: any[];
        };
        bounds: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        constructor();
        getNonFillerVoronoiLines(visibleStars?: Star[]): any[];
        getStarAtPoint(point: Point): any;
    }
}
declare namespace Rance {
    class FillerPoint implements Point {
        x: number;
        y: number;
        mapGenData: any;
        voronoiCell: any;
        voronoiId: number;
        constructor(x: number, y: number);
        setPosition(x: number, y: number): void;
        serialize(): Point;
    }
}
declare namespace Rance {
    namespace MapGenCore {
        class Triangle {
            a: Point;
            b: Point;
            c: Point;
            circumCenterX: number;
            circumCenterY: number;
            circumRadius: number;
            constructor(a: Point, b: Point, c: Point);
            getPoints(): Point[];
            getCircumCenter(): number[];
            calculateCircumCircle(tolerance?: number): void;
            circumCircleContainsPoint(point: Point): boolean;
            getEdges(): Point[][];
            getAmountOfSharedVerticesWith(toCheckAgainst: Triangle): number;
        }
    }
}
declare namespace Rance {
    namespace MapGenCore {
        function triangulate(vertices: Point[]): Triangle[];
        function getCentroid(vertices: Point[]): Point;
        function pointsEqual(p1: Point, p2: Point): boolean;
    }
}
declare namespace Rance {
    namespace MapGenCore {
        function makeVoronoi(points: Point[], width: number, height: number): any;
        /**
         * Perform one iteration of Lloyd's Algorithm to move points in voronoi diagram to their centroid
         * @param {any}             diagram Voronoi diagram to relax
         * @param {(any) => number} dampeningFunction If specified, use value returned by dampeningFunction(cell.site)
         *                                            to adjust how far towards centroid the point is moved.
         *                                            0.0 = not moved, 0.5 = moved halfway, 1.0 = moved fully
         */
        function relaxVoronoi(diagram: any, dampeningFunction?: (point: any) => number): void;
    }
}
declare namespace Rance {
    namespace MapGenCore {
        class MapGenResult {
            stars: Star[];
            fillerPoints: FillerPoint[];
            width: number;
            height: number;
            seed: string;
            independents: Player[];
            voronoiInfo: MapVoronoiInfo;
            constructor(props: {
                stars: Star[];
                fillerPoints: FillerPoint[];
                width: number;
                height: number;
                seed: string;
                independents: Player[];
            });
            getAllPoints(): Point[];
            makeMap(): GalaxyMap;
            makeVoronoiInfo(): MapVoronoiInfo;
            makeVoronoiTreeMap(): any;
            clearMapGenData(): void;
        }
    }
}
declare namespace Rance {
    enum NotificationFilterState {
        alwaysShow = 0,
        showIfInvolved = 1,
        neverShow = 2,
    }
}
declare namespace Rance {
    class Notification {
        template: NotificationTemplate;
        props: any;
        turn: number;
        hasBeenRead: boolean;
        constructor(template: NotificationTemplate, props: any, turn: number);
        makeMessage(): string;
        serialize(): INotificationSaveData;
    }
}
declare namespace Rance {
    class NotificationFilter {
        filters: {
            [notificationKey: string]: NotificationFilterState[];
        };
        player: Player;
        constructor(player: Player);
        setDefaultFilterStates(): void;
        shouldDisplayNotification(notification: Notification): boolean;
        getCompatibleFilterStates(filterState: NotificationFilterState): NotificationFilterState[];
        handleFilterStateChange(filterKey: string, state: NotificationFilterState): void;
        getFiltersByCategory(): {
            [category: string]: {
                notificationTemplate: NotificationTemplate;
                filterState: NotificationFilterState[];
            }[];
        };
        setDefaultFilterStatesForCategory(category: string): void;
        load(slot?: number): void;
        save(slot?: number): void;
    }
}
declare namespace Rance {
    class NotificationLog {
        byTurn: {
            [turnNumber: number]: Notification[];
        };
        unread: Notification[];
        currentTurn: number;
        isHumanTurn: boolean;
        listeners: {
            [name: string]: Function[];
        };
        notificationFilter: NotificationFilter;
        constructor(player: Player);
        addEventListeners(): void;
        destroy(): void;
        setTurn(turn: number, isHumanTurn: boolean): void;
        makeNotification(template: NotificationTemplate, props: any): void;
        addNotification(notification: Notification): void;
        markAsRead(notification: Notification): void;
        getUnreadNotificationsForTurn(turn: number): Notification[];
        filterNotifications(notifications: Notification[]): Notification[];
        serialize(): INotificationLogSaveData;
    }
}
declare namespace Rance {
    class Game {
        turnNumber: number;
        independents: Player[];
        playerOrder: Player[];
        galaxyMap: GalaxyMap;
        humanPlayer: Player;
        activePlayer: Player;
        notificationLog: NotificationLog;
        gameStorageKey: string;
        constructor(map: GalaxyMap, players: Player[], humanPlayer: Player);
        destroy(): void;
        endTurn(): void;
        processPlayerStartTurn(player: Player): void;
        setNextPlayer(): void;
        killPlayer(playerToKill: Player): void;
        serialize(): IGameSaveData;
        save(name: string): void;
    }
}
declare namespace Rance {
    class GalaxyMap {
        stars: Star[];
        fillerPoints: FillerPoint[];
        width: number;
        height: number;
        seed: string;
        independents: Player[];
        voronoi: MapVoronoiInfo;
        constructor(mapGen: MapGenCore.MapGenResult);
        getIncomeBounds(): {
            min: number;
            max: number;
        };
        serialize(): IGalaxyMapSaveData;
    }
}
declare namespace Rance {
    namespace MapAI {
        var defaultEvaluationParameters: {
            starDesirability: {
                neighborRange: number;
                neighborWeight: number;
                defendabilityWeight: number;
                totalIncomeWeight: number;
                baseIncomeWeight: number;
                infrastructureWeight: number;
                productionWeight: number;
            };
        };
        interface IIndependentTargetEvaluations {
            [starId: number]: {
                star: Star;
                desirability: number;
                independentStrength: number;
                ownInfluence: number;
            };
        }
        class MapEvaluator {
            map: GalaxyMap;
            player: Player;
            game: Game;
            cachedInfluenceMaps: {
                [turnNumber: number]: {
                    [playerId: number]: {
                        [starId: number]: number;
                    };
                };
            };
            cachedVisibleFleets: {
                [turnNumber: number]: {
                    [playerId: number]: Fleet[];
                };
            };
            cachedVisionMaps: {
                [playerId: number]: {
                    visible: {
                        [starId: number]: Star;
                    };
                    detected: {
                        [starId: number]: Star;
                    };
                };
            };
            cachedOwnIncome: number;
            evaluationParameters: {
                starDesirability: {
                    neighborRange: number;
                    neighborWeight: number;
                    defendabilityWeight: number;
                    totalIncomeWeight: number;
                    baseIncomeWeight: number;
                    infrastructureWeight: number;
                    productionWeight: number;
                };
            };
            constructor(map: GalaxyMap, player: Player, game?: Game);
            processTurnStart(): void;
            evaluateStarIncome(star: Star): number;
            evaluateStarInfrastructure(star: Star): number;
            evaluateStarProduction(star: Star): number;
            evaluateStarDefendability(star: Star): number;
            evaluateIndividualStarDesirability(star: Star): number;
            evaluateNeighboringStarsDesirability(star: Star, range: number): number;
            evaluateStarDesirability(star: Star): number;
            evaluateIndependentTargets(targetStars: Star[]): IIndependentTargetEvaluations;
            scoreIndependentTargets(evaluations: IIndependentTargetEvaluations): {
                star: Star;
                score: number;
            }[];
            evaluateDesirabilityOfPlayersStars(player: Player): {
                byStar: {
                    [starId: number]: {
                        star: Star;
                        desirability: number;
                    };
                };
                total: number;
            };
            getIndependentNeighborStars(): Star[];
            getIndependentNeighborStarIslands(earlyReturnSize?: number): Star[];
            getHostileUnitsAtStar(star: Star): {
                byEnemy: {
                    [playerId: number]: Unit[];
                };
                all: Unit[];
            };
            getHostileStrengthAtStar(star: Star): {
                [playerId: number]: number;
            };
            getIndependentStrengthAtStar(star: Star): number;
            getTotalHostileStrengthAtStar(star: Star): number;
            getDefenceBuildingStrengthAtStarByPlayer(star: Star): {
                [playerId: number]: number;
            };
            getTotalDefenceBuildingStrengthAtStar(star: Star): number;
            evaluateFleetStrength(fleet: Fleet): number;
            getVisibleFleetsByPlayer(): {
                [playerId: number]: Fleet[];
            };
            buildPlayerInfluenceMap(player: Player): {
                [starId: number]: number;
            };
            getPlayerInfluenceMap(player: Player): {
                [starId: number]: number;
            };
            getInfluenceMapsForKnownPlayers(): {
                [playerId: number]: {
                    [starId: number]: number;
                };
            };
            getVisibleStarsOfPlayer(player: Player): Star[];
            getVisibleStarsOfKnownPlayers(): {
                [playerId: number]: Star[];
            };
            estimateGlobalStrength(player: Player): number;
            getPerceivedThreatOfPlayer(player: Player): number;
            getPerceivedThreatOfAllKnownPlayers(): {
                [playerId: number]: number;
            };
            getRelativePerceivedThreatOfAllKnownPlayers(): {
                [playerId: number]: number;
            };
            getVisionCoverageAroundStar(star: Star, range: number, useDetection?: boolean): number;
            estimateFleetRange(fleet: Fleet, baseRange: number, afterSixUnits: number, getRangeFNName: string): number;
            estimateFleetVisionRange(fleet: Fleet): number;
            estimateFleetDetectionRange(fleet: Fleet): number;
            buildPlayerVisionMap(player: Player): {
                visible: {
                    [starId: number]: Star;
                };
                detected: {
                    [starId: number]: Star;
                };
            };
            getPlayerVisionMap(player: Player): {
                visible: {
                    [starId: number]: Star;
                };
                detected: {
                    [starId: number]: Star;
                };
            };
            getScoredPerimeterLocationsAgainstPlayer(player: Player, safetyFactor: number, forScouting: boolean): {
                score: number;
                star: Star;
            }[];
            getDesireToGoToWarWith(player: Player): number;
            getAbilityToGoToWarWith(player: Player): number;
            getDiplomacyEvaluations(currentTurn: number): {
                [playerId: number]: IDiplomacyEvaluation;
            };
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class GrandStrategyAI {
            personality: IPersonality;
            mapEvaluator: MapEvaluator;
            desireForWar: number;
            desireForExpansion: number;
            desireForConsolidation: number;
            private desiredStars;
            constructor(personality: IPersonality, mapEvaluator: MapEvaluator);
            private setDesiredStars();
            setDesires(): void;
            getDesireForWar(): number;
            getDesireForExpansion(): number;
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class Objective {
            id: number;
            template: ObjectiveTemplate;
            type: string;
            private _basePriority;
            priority: number;
            isOngoing: boolean;
            target: Star;
            targetPlayer: Player;
            constructor(template: ObjectiveTemplate, priority: number, target: Star, targetPlayer?: Player);
            getUnitsDesired(mapEvaluator: MapEvaluator): {
                min: number;
                ideal: number;
            };
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class ObjectivesAI {
            mapEvaluator: MapEvaluator;
            map: GalaxyMap;
            player: Player;
            grandStrategyAI: GrandStrategyAI;
            objectivesByType: {
                [objectiveType: string]: Objective[];
            };
            objectives: Objective[];
            requests: any[];
            constructor(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI);
            clearObjectives(): void;
            setAllDiplomaticObjectives(): void;
            setAllEconomicObjectives(): void;
            setAllMoveObjectives(): void;
            setAllObjectivesWithTemplateProperty(propKey: string): void;
            getNewObjectivesOfType(objectiveTemplate: ObjectiveTemplate): Objective[];
            setObjectivesOfType(objectiveTemplate: ObjectiveTemplate): void;
            getObjectivesByTarget(objectiveType: string, markAsOngoing: boolean): {
                [targetString: string]: Objective;
            };
            getObjectivesWithTemplateProperty(propKey: string): Objective[];
            getAdjustmentsForTemplateProperty(propKey: string): IRoutineAdjustmentByTargetId;
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class Front {
            id: number;
            objective: Objective;
            units: Unit[];
            minUnitsDesired: number;
            idealUnitsDesired: number;
            targetLocation: Star;
            musterLocation: Star;
            hasMustered: boolean;
            constructor(props: {
                id: number;
                objective: Objective;
                units?: Unit[];
                minUnitsDesired: number;
                idealUnitsDesired: number;
                targetLocation: Star;
                musterLocation: Star;
            });
            organizeFleets(): void;
            isFleetPure(fleet: Fleet): boolean;
            getAssociatedFleets(): Fleet[];
            getUnitIndex(unit: Unit): number;
            addUnit(unit: Unit): void;
            removeUnit(unit: Unit): void;
            getUnitCountByArchetype(): IArchetypeValues;
            getUnitsByLocation(): {
                [starId: number]: Unit[];
            };
            moveFleets(afterMoveCallback: () => void): void;
            hasUnit(unit: Unit): boolean;
            scoreUnitFit(unit: Unit): number;
            getNewUnitArchetypeScores(): IArchetypeValues;
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class FrontsAI {
            player: Player;
            map: GalaxyMap;
            mapEvaluator: MapEvaluator;
            objectivesAI: ObjectivesAI;
            personality: IPersonality;
            fronts: Front[];
            frontsRequestingUnits: Front[];
            frontsToMove: Front[];
            constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI, personality: IPersonality);
            private getUnitScoresForFront(units, front);
            assignUnits(): void;
            getFrontWithId(id: number): Front;
            createFront(objective: Objective): Front;
            removeInactiveFronts(): void;
            formFronts(): void;
            organizeFleets(): void;
            setFrontsToMove(): void;
            moveFleets(afterMovingAllCallback: Function): void;
            setUnitRequests(): void;
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class EconomyAI {
            objectivesAI: ObjectivesAI;
            frontsAI: FrontsAI;
            mapEvaluator: MapEvaluator;
            player: Player;
            personality: IPersonality;
            constructor(props: {
                objectivesAI: ObjectivesAI;
                frontsAI: FrontsAI;
                mapEvaluator: MapEvaluator;
                personality: IPersonality;
            });
            resolveEconomicObjectives(): void;
            satisfyAllRequests(): void;
            satisfyFrontRequest(front: Front): void;
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class DiplomacyAI {
            game: Game;
            player: Player;
            diplomacyStatus: DiplomacyStatus;
            personality: IPersonality;
            mapEvaluator: MapEvaluator;
            objectivesAI: ObjectivesAI;
            constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI, game: Game, personality: IPersonality);
            setAttitudes(): void;
            resolveDiplomaticObjectives(afterAllDoneCallback: () => void): void;
            resolveNextObjective(objectives: Objective[], adjustments: IRoutineAdjustmentByTargetId, afterAllDoneCallback: () => void): void;
        }
    }
}
declare namespace Rance {
    namespace MapAI {
        class AIController {
            player: Player;
            game: Game;
            personality: IPersonality;
            map: GalaxyMap;
            mapEvaluator: MapEvaluator;
            grandStrategyAI: GrandStrategyAI;
            objectivesAI: ObjectivesAI;
            economyAI: EconomyAI;
            frontsAI: FrontsAI;
            diplomacyAI: DiplomacyAI;
            constructor(player: Player, game: Game, personality?: IPersonality);
            processTurn(afterFinishedCallback: () => void): void;
            processTurnAfterDiplomaticObjectives(afterFinishedCallback: () => void): void;
            finishMovingFleets(afterFinishedCallback: () => void): void;
        }
    }
}
declare namespace Rance {
    class Player {
        id: number;
        name: string;
        color: number;
        colorAlpha: number;
        secondaryColor: number;
        flag: Flag;
        units: {
            [id: number]: Unit;
        };
        resources: {
            [resourceType: string]: number;
        };
        fleets: Fleet[];
        items: Item[];
        isAI: boolean;
        personality: IPersonality;
        AIController: MapAI.AIController;
        isIndependent: boolean;
        diplomacyStatus: DiplomacyStatus;
        private _money;
        money: number;
        controlledLocations: Star[];
        visionIsDirty: boolean;
        visibleStars: {
            [id: number]: Star;
        };
        revealedStars: {
            [id: number]: Star;
        };
        detectedStars: {
            [id: number]: Star;
        };
        identifiedUnits: {
            [id: number]: Unit;
        };
        tempOverflowedResearchAmount: number;
        playerTechnology: PlayerTechnology;
        listeners: {
            [key: string]: Function;
        };
        constructor(isAI: boolean, id?: number);
        destroy(): void;
        die(): void;
        initTechnologies(savedData?: {
            [key: string]: {
                totalResearch: number;
                priority: number;
                priorityIsLocked: boolean;
            };
        }): void;
        makeColorScheme(): void;
        setupAI(game: Game): void;
        makeRandomFlag(seed?: any): void;
        addUnit(unit: Unit): void;
        removeUnit(unit: Unit): void;
        getAllUnits(): Unit[];
        forEachUnit(operator: (unit: Unit) => void): void;
        getFleetIndex(fleet: Fleet): number;
        addFleet(fleet: Fleet): void;
        removeFleet(fleet: Fleet): void;
        getFleetsWithPositions(): {
            position: Point;
            data: Fleet;
        }[];
        hasStar(star: Star): boolean;
        addStar(star: Star): boolean;
        removeStar(star: Star): boolean;
        getIncome(): number;
        addResource(resource: ResourceTemplate, amount: number): void;
        getResourceIncome(): {
            [resourceType: string]: {
                resource: ResourceTemplate;
                amount: number;
            };
        };
        getNeighboringStars(): Star[];
        updateVisionInStar(star: Star): void;
        updateDetectionInStar(star: Star): void;
        updateAllVisibilityInStar(star: Star): void;
        meetPlayersInStarByVisibility(star: Star, visibility: string): void;
        updateVisibleStars(): void;
        getVisibleStars(): Star[];
        getRevealedStars(): Star[];
        getRevealedButNotVisibleStars(): Star[];
        getDetectedStars(): Star[];
        starIsVisible(star: Star): boolean;
        starIsRevealed(star: Star): boolean;
        starIsDetected(star: Star): boolean;
        getLinksToUnRevealedStars(): {
            [starId: number]: Star[];
        };
        identifyUnit(unit: Unit): void;
        unitIsIdentified(unit: Unit): boolean;
        fleetIsFullyIdentified(fleet: Fleet): boolean;
        addItem(item: Item): void;
        removeItem(item: Item): void;
        getNearestOwnedStarTo(star: Star): Star;
        attackTarget(location: Star, target: IFleetAttackTarget, battleFinishCallback?: () => void): void;
        getResearchSpeed(): number;
        getAllManufactories(): Manufactory[];
        meetsTechnologyRequirements(requirements: TechnologyRequirement[]): boolean;
        getGloballyBuildableUnits(): UnitTemplate[];
        getGloballyBuildableItems(): ItemTemplate[];
        getManufacturingCapacityFor(template: IManufacturableThing, type: string): number;
        serialize(): IPlayerSaveData;
    }
}
declare namespace Rance {
    interface ITurnOrderDisplayData {
        moveDelay: number;
        isGhost: boolean;
        unit: Unit;
        displayName: string;
    }
    class BattleTurnOrder {
        private allUnits;
        private orderedUnits;
        constructor();
        destroy(): void;
        private hasUnit(unit);
        addUnit(unit: Unit): void;
        private static turnOrderFilterFN(unit);
        private static turnOrderSortFN(a, b);
        update(): void;
        getActiveUnit(): Unit;
        private static getDisplayDataFromUnit(unit);
        private static makeGhostDisplayData(ghostMoveDelay);
        private getGhostIndex(ghostMoveDelay, ghostId);
        getDisplayData(ghostMoveDelay?: number, ghostId?: number): ITurnOrderDisplayData[];
    }
}
declare namespace Rance {
    class Battle {
        unitsById: {
            [id: number]: Unit;
        };
        unitsBySide: {
            side1: Unit[];
            side2: Unit[];
        };
        side1: Unit[][];
        side1Player: Player;
        side2: Unit[][];
        side2Player: Player;
        battleData: IBattleData;
        turnOrder: BattleTurnOrder;
        activeUnit: Unit;
        currentTurn: number;
        maxTurns: number;
        turnsLeft: number;
        startHealth: {
            side1: number;
            side2: number;
        };
        evaluation: {
            [turnNumber: number]: number;
        };
        isSimulated: boolean;
        isVirtual: boolean;
        ended: boolean;
        capturedUnits: Unit[];
        deadUnits: Unit[];
        afterFinishCallbacks: any[];
        constructor(props: {
            battleData: IBattleData;
            side1: Unit[][];
            side2: Unit[][];
            side1Player: Player;
            side2Player: Player;
        });
        init(): void;
        forEachUnit(operator: (unit: Unit) => any): void;
        initUnit(unit: Unit, side: UnitBattleSide, position: number[]): void;
        triggerBattleStartAbilities(): void;
        endTurn(): void;
        getPlayerForSide(side: UnitBattleSide): Player;
        getSideForPlayer(player: Player): UnitBattleSide;
        getActivePlayer(): Player;
        getRowByPosition(position: number): any;
        getCapturedUnits(victor: Player, maxCapturedUnits: number): Unit[];
        getUnitDeathChance(unit: Unit, victor: Player): number;
        getDeadUnits(capturedUnits: Unit[], victor: Player): Unit[];
        endBattle(): void;
        finishBattle(forcedVictor?: Player): void;
        getVictor(): Player;
        getTotalHealthForRow(position: number): number;
        getTotalHealthForSide(side: UnitBattleSide): {
            current: number;
            max: number;
        };
        getEvaluation(): number;
        getAbsolutePositionFromSidePosition(relativePosition: number[], side: UnitBattleSide): number[];
        updateBattlePositions(side: UnitBattleSide): void;
        shiftRowsForSide(side: UnitBattleSide): void;
        shiftRowsIfNeeded(): void;
        getGainedExperiencePerSide(): {
            side1: number;
            side2: number;
        };
        checkBattleEnd(): boolean;
        makeVirtualClone(): Battle;
        private updateTurnOrder();
    }
}
declare namespace Rance {
    type UnitBattleSide = "side1" | "side2";
    var UnitBattleSidesArray: UnitBattleSide[];
    enum GuardCoverage {
        row = 0,
        all = 1,
    }
    interface IQueuedActionData {
        ability: AbilityTemplate;
        targetId: number;
        turnsPrepared: number;
        timesInterrupted: number;
    }
    interface IUnitBattleStats {
        moveDelay: number;
        side: UnitBattleSide;
        position: number[];
        currentActionPoints: number;
        guardAmount: number;
        guardCoverage: GuardCoverage;
        captureChance: number;
        statusEffects: StatusEffect[];
        lastHealthBeforeReceivingDamage: number;
        queuedAction: IQueuedActionData;
        isAnnihilated: boolean;
    }
    interface IUnitItems {
        low: Item;
        mid: Item;
        high: Item;
    }
    class Unit {
        template: UnitTemplate;
        id: number;
        name: string;
        portrait: PortraitTemplate;
        maxHealth: number;
        currentHealth: number;
        isSquadron: boolean;
        currentMovePoints: number;
        maxMovePoints: number;
        timesActedThisTurn: number;
        baseAttributes: IUnitAttributes;
        attributesAreDirty: boolean;
        cachedAttributes: IUnitAttributes;
        attributes: IUnitAttributes;
        battleStats: IUnitBattleStats;
        abilities: AbilityTemplate[];
        passiveSkills: PassiveSkillTemplate[];
        experienceForCurrentLevel: number;
        level: number;
        fleet: Fleet;
        items: IUnitItems;
        passiveSkillsByPhase: {
            atBattleStart?: PassiveSkillTemplate[];
            beforeAbilityUse?: PassiveSkillTemplate[];
            afterAbilityUse?: PassiveSkillTemplate[];
            atTurnStart?: PassiveSkillTemplate[];
            inBattlePrep?: PassiveSkillTemplate[];
        };
        passiveSkillsByPhaseAreDirty: boolean;
        front: MapAI.Front;
        uiDisplayIsDirty: boolean;
        displayFlags: {
            isAnnihilated: boolean;
        };
        sfxDuration: number;
        lastHealthDrawnAt: number;
        displayedHealth: number;
        constructor(template: UnitTemplate, id?: number, data?: IUnitSaveData);
        makeFromData(data: IUnitSaveData): void;
        setInitialValues(): void;
        setBaseHealth(multiplier?: number): void;
        setAttributes(baseSkill?: number, variance?: number): void;
        setCulture(): void;
        getBaseMoveDelay(): number;
        resetMovePoints(): void;
        resetBattleStats(): void;
        setBattlePosition(battle: Battle, side: UnitBattleSide, position: number[]): void;
        addStrength(amount: number): void;
        removeStrength(amount: number): void;
        removeActionPoints(amount: number): void;
        addMoveDelay(amount: number): void;
        updateStatusEffects(): void;
        setQueuedAction(ability: AbilityTemplate, target: Unit): void;
        interruptQueuedAction(interruptStrength: number): void;
        updateQueuedAction(): void;
        isReadyToUseQueuedAction(): boolean;
        clearQueuedAction(): void;
        isTargetable(): boolean;
        isActiveInBattle(): boolean;
        addItem(item: Item): boolean;
        removeItem(item: Item): boolean;
        destroyAllItems(): void;
        getAttributesWithItems(): any;
        addStatusEffect(statusEffect: StatusEffect): void;
        removeStatusEffect(statusEffect: StatusEffect): void;
        getTotalStatusEffectAttributeAdjustments(): StatusEffectAttributes;
        getAttributesWithEffects(): any;
        updateCachedAttributes(): void;
        removeItemAtSlot(slot: string): boolean;
        setInitialAbilities(): void;
        setInitialPassiveSkills(): void;
        getItemAbilities(): AbilityTemplate[];
        getAllAbilities(): AbilityTemplate[];
        getItemPassiveSkills(): PassiveSkillTemplate[];
        getStatusEffectPassiveSkills(): PassiveSkillTemplate[];
        getAllPassiveSkills(): PassiveSkillTemplate[];
        updatePassiveSkillsByPhase(): void;
        getPassiveSkillsByPhase(): {
            atBattleStart?: PassiveSkillTemplate[];
            beforeAbilityUse?: PassiveSkillTemplate[];
            afterAbilityUse?: PassiveSkillTemplate[];
            atTurnStart?: PassiveSkillTemplate[];
            inBattlePrep?: PassiveSkillTemplate[];
        };
        receiveDamage(amount: number, damageType: DamageType): void;
        getAdjustedTroopSize(): number;
        getAttackDamageIncrease(damageType: DamageType): number;
        getReducedDamageFactor(damageType: DamageType): number;
        addToFleet(fleet: Fleet): void;
        removeFromFleet(): void;
        removeFromPlayer(): void;
        transferToPlayer(newPlayer: Player): void;
        removeGuard(amount: number): void;
        addGuard(amount: number, coverage: GuardCoverage): void;
        removeAllGuard(): void;
        getCounterAttackStrength(): number;
        canActThisTurn(): boolean;
        isStealthy(): boolean;
        getVisionRange(): number;
        getDetectionRange(): number;
        heal(): void;
        getStrengthEvaluation(): number;
        getTotalCost(): number;
        getTurnsToReachStar(star: Star): number;
        getExperienceToNextLevel(): number;
        addExperience(amount: number): void;
        canLevelUp(): boolean;
        handleLevelUp(): void;
        hasAbility(ability: AbilityBase, allAbilities: AbilityBase[]): boolean;
        getLearnableAbilities(allAbilities: AbilityBase[]): AbilityBase[];
        canUpgradeIntoAbility(ability: AbilityBase, allAbilities: AbilityBase[]): boolean;
        getAbilityUpgradeData(): {
            [source: string]: {
                base: AbilityBase;
                possibleUpgrades: AbilityBase[];
            };
        };
        upgradeAbility(source: AbilityBase, newAbility: AbilityBase): void;
        drawBattleScene(SFXParams: Templates.SFXParams): void;
        serialize(includeItems?: boolean, includeFluff?: boolean): IUnitSaveData;
        makeVirtualClone(): Unit;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitStrength: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitActions: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitStatus: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitInfo: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitIcon: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitStatusEffects: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitPortrait: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Draggable: {
            getDefaultProps: () => {
                dragThreshhold: number;
            };
            getInitialState: () => {
                dragging: boolean;
                clone: Node;
            };
            componentWillMount: () => void;
            componentDidMount: () => void;
            componentWillUnmount: () => void;
            handleMouseDown: (e: MouseEvent) => void;
            handleMouseMove: (e: MouseEvent) => void;
            handleDrag: (e: MouseEvent) => void;
            handleMouseUp: (e: MouseEvent) => void;
            handleDragEnd: (e: MouseEvent) => void;
            addEventListeners: () => void;
            removeEventListeners: () => void;
            setContainerRect: () => void;
            updateDOMNodeStyle: () => void;
        };
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Unit: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var EmptyUnit: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var DropTarget: {
            componentDidMount: () => void;
            componentWillUnmount: () => void;
        };
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitWrapper: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FormationRow: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Formation: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TurnCounter: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TurnOrder: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var AbilityTooltip: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattleSceneFlag: React.ClassicFactory<{}>;
    }
}
declare var bs: any;
declare namespace Rance {
    namespace UIComponents {
        var BattleScene: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var PlayerFlag: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattleScore: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattleDisplayStrength: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattleBackground: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Battle: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var SplitMultilineText: {
            splitMultilineText: (text: any) => any;
        };
    }
}
declare namespace Rance {
    namespace UIComponents {
        interface IListColumn {
            label: string;
            title?: string;
            key: string;
            defaultOrder?: string;
            order?: string;
            notSortable?: boolean;
            propToSortBy?: string;
            sortingFunction?: <T>(a: T, b: T) => number;
        }
        interface IListItem {
            key: string | number;
            data: any;
        }
        var List: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitListItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ItemListItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ItemList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var AbilityList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitItemWrapper: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UpgradeAbilities: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UpgradeAttributes: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UpgradeUnit: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UnitExperience: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MenuUnitInfo: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ItemEquip: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var DefenceBuilding: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var DefenceBuildingList: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattleInfo: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattlePrep: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var PopupResizeHandle: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Popup: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ConfirmPopup: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var PopupManager: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var SaveListItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var SaveList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var SaveGame: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var LoadGame: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    interface ITradeableItem {
        key: string;
        amount: number;
    }
    interface ITradeableItems {
        [key: string]: ITradeableItem;
    }
    class Trade {
        allItems: ITradeableItems;
        stagedItems: ITradeableItems;
        player: Player;
        constructor(player: Player);
        setAllTradeableItems(): void;
        getItemsAvailableForTrade(): ITradeableItems;
        removeStagedItem(key: string): void;
        removeAllStagedItems(): void;
        stageItem(key: string, amount: number): void;
        setStagedItemAmount(key: string, newAmount: number): void;
        handleTradeOfItem(key: string, amount: number, targetPlayer: Player): void;
        executeAllStagedTrades(targetPlayer: Player): void;
        updateAfterExecutedTrade(): void;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TradeMoney: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TradeableItemsList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TradeableItems: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TradeOverview: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var DiplomacyActions: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var AutoPosition: {
            componentDidMount: () => void;
            componentDidUpdate: () => void;
            flipSide: (side: string) => string;
            elementFitsYSide: (side: string, ownRect: ClientRect, parentRect: ClientRect) => boolean;
            elementFitsXSide: (side: string, ownRect: ClientRect, parentRect: ClientRect) => boolean;
            setAutoPosition: () => void;
        };
    }
}
declare namespace Rance {
    namespace UIComponents {
        var AttitudeModifierInfo: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var AttitudeModifierList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Opinion: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var DiplomaticStatusPlayer: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var DiplomacyOverview: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var EconomySummaryItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var EconomySummary: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var OptionsGroup: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var NotificationFilterListItem: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var NotificationFilterList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var NotificationFilterButton: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var OptionsCheckbox: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var OptionsNumericField: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var OptionsList: React.ClassicFactory<{}>;
    }
}
declare module "src/uicomponents/technologies/technologyPrioritySlider" {
    export const Factory: React.Factory<any>;
    export interface PropTypes {
        playerTechnology: PlayerTechnology;
        technology: TechnologyTemplate;
        researchPoints: number;
    }
}
declare module "src/uicomponents/technologies/technology" {
}
declare namespace Rance {
    namespace UIComponents {
        var TechnologiesList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufactoryStarsListItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufactoryStarsList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufacturableThingsListItem: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufacturableThingsList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufactoryUpgradeButton: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BuildQueue: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufacturableUnits: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufacturableItems: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ManufacturableThings: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ConstructManufactory: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var UpdateWhenMoneyChanges: {
            handleMoneyChange: () => void;
            componentDidMount: () => void;
            componentWillUnmount: () => void;
        };
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ProductionOverview: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TopMenuPopup: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TopMenuPopups: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TopMenu: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var PlayerMoney: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Resource: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TopBarResources: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var TopBar: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetControls: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetInfo: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetUnitInfoName: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetUnitInfo: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetContents: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetReorganization: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FleetSelection: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var StarInfo: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var AttackTarget: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BuildableBuilding: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BuildableBuildingList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BuildingUpgradeListItem: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BuildingUpgradeList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var PossibleActions: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    class MapRendererLayer {
        template: IMapRendererLayerTemplate;
        container: PIXI.Container;
        isDirty: boolean;
        private _alpha;
        alpha: number;
        constructor(template: IMapRendererLayerTemplate);
        resetAlpha(): void;
        draw(map: GalaxyMap, mapRenderer: MapRenderer): void;
    }
}
declare namespace Rance {
    class MapRendererMapMode {
        template: IMapRendererMapModeTemplate;
        displayName: string;
        layers: MapRendererLayer[];
        activeLayers: {
            [layerName: string]: boolean;
        };
        constructor(template: IMapRendererMapModeTemplate);
        addLayer(layer: MapRendererLayer, isActive?: boolean): void;
        getLayerIndex(layer: MapRendererLayer): number;
        hasLayer(layer: MapRendererLayer): boolean;
        getLayerIndexInContainer(layer: MapRendererLayer): number;
        toggleLayer(layer: MapRendererLayer): void;
        setLayerIndex(layer: MapRendererLayer, newIndex: number): void;
        insertLayerNextToLayer(toInsert: MapRendererLayer, target: MapRendererLayer, position: string): void;
        getActiveLayers(): MapRendererLayer[];
        resetLayers(): void;
    }
}
declare namespace Rance {
    function starsOnlyShareNarrowBorder(a: Star, b: Star): boolean;
    function getBorderingHalfEdges(stars: Star[]): {
        star: Star;
        halfEdge: any;
    }[];
    function joinPointsWithin(points: Point[], maxDistance: number): void;
    function convertHalfEdgeDataToOffset(halfEdgeData: {
        star: Star;
        halfEdge: any;
    }[]): OffsetPoint[];
    function getRevealedBorderEdges(revealedStars: Star[], voronoiInfo: MapVoronoiInfo): {
        points: any[];
        isClosed: boolean;
    }[];
}
declare namespace Rance {
    interface IMapRendererMapMode {
        name: string;
        displayName: string;
        layers: {
            layer: MapRendererLayer;
        }[];
    }
    class MapRenderer {
        container: PIXI.Container;
        parent: PIXI.Container;
        galaxyMap: GalaxyMap;
        player: Player;
        occupationShaders: {
            [ownerId: string]: {
                [occupierId: string]: PIXI.AbstractFilter;
            };
        };
        layers: {
            [name: string]: MapRendererLayer;
        };
        mapModes: {
            [name: string]: MapRendererMapMode;
        };
        fowTilingSprite: PIXI.extras.TilingSprite;
        fowSpriteCache: {
            [starId: number]: PIXI.Sprite;
        };
        fleetTextTextureCache: {
            [fleetSize: number]: PIXI.Texture;
        };
        currentMapMode: MapRendererMapMode;
        isDirty: boolean;
        preventRender: boolean;
        listeners: {
            [name: string]: Function;
        };
        constructor(map: GalaxyMap, player: Player);
        destroy(): void;
        init(): void;
        addEventListeners(): void;
        setPlayer(player: Player): void;
        updateShaderOffsets(x: number, y: number): void;
        updateShaderZoom(zoom: number): void;
        makeFowSprite(): void;
        getFowSpriteForStar(star: Star): PIXI.Sprite;
        getOccupationShader(owner: Player, occupier: Player): PIXI.AbstractFilter;
        getFleetTextTexture(fleet: Fleet): PIXI.Texture;
        initLayers(): void;
        initMapModes(): void;
        setParent(newParent: PIXI.Container): void;
        resetContainer(): void;
        setLayerAsDirty(layerName: string): void;
        setAllLayersAsDirty(): void;
        updateMapModeLayers(updatedLayers: MapRendererLayer[]): void;
        resetMapModeLayersPosition(): void;
        setMapModeByKey(key: string): void;
        setMapMode(newMapMode: MapRendererMapMode): void;
        render(): void;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapModeSelector: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapRendererLayersListItem: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapRendererLayersList: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapModeSettings: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Notification: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var NotificationLog: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Notifications: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace Tutorials {
        var introTutorial: {
            pages: {
                content: string[];
            }[];
        };
    }
}
declare namespace Rance {
    enum tutorialStatus {
        neverShow = -1,
        dontShowThisSession = 0,
        show = 1,
    }
    function saveTutorialState(): void;
    function loadTutorialState(): void;
    function resetTutorialState(): void;
    var defaultTutorialState: {
        introTutorial: tutorialStatus;
    };
    var TutorialState: any;
}
declare namespace Rance {
    namespace UIComponents {
        var DontShowAgain: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var Tutorial: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var IntroTutorial: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var GalaxyMapUI: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var GalaxyMap: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FocusTimer: {
            componentDidMount: () => void;
            registerFocusTimerListener: () => void;
            clearFocusTimerListener: () => void;
            setFocusTimer: () => void;
        };
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ColorPicker: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var ColorSetter: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FlagPicker: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FlagSetter: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var PlayerSetup: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var SetupGamePlayers: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapGenOption: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapGenOptions: React.ClassicFactory<any>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var MapSetup: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var SetupGame: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var FlagMaker: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        var BattleSceneTester: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    namespace UIComponents {
        interface ReactComponentPlaceHolder {
        }
        interface ReactDOMPlaceHolder {
        }
        var Stage: React.ClassicFactory<{}>;
    }
}
declare namespace Rance {
    class ReactUI {
        container: HTMLElement;
        currentScene: string;
        stage: any;
        battle: Battle;
        battlePrep: BattlePrep;
        renderer: Renderer;
        mapRenderer: MapRenderer;
        playerControl: PlayerControl;
        player: Player;
        game: Game;
        switchSceneFN: any;
        constructor(container: HTMLElement);
        addEventListeners(): void;
        switchScene(newScene: string): void;
        destroy(): void;
        render(): void;
    }
}
declare namespace Rance {
    class PlayerControl {
        player: Player;
        selectedFleets: Fleet[];
        inspectedFleets: Fleet[];
        currentlyReorganizing: Fleet[];
        lastSelectedFleetsIds: {
            [fleetId: number]: boolean;
        };
        currentAttackTargets: IFleetAttackTarget[];
        selectedStar: Star;
        preventingGhost: boolean;
        listeners: {
            [listenerName: string]: any;
        };
        constructor(player: Player);
        destroy(): void;
        removeEventListener(name: string): void;
        removeEventListeners(): void;
        addEventListener(name: string, handler: Function): void;
        addEventListeners(): void;
        preventGhost(delay: number): void;
        clearSelection(): void;
        updateSelection(endReorganizingFleets?: boolean): void;
        areAllFleetsInSameLocation(): boolean;
        selectFleets(fleets: Fleet[]): void;
        selectPlayerFleets(fleets: Fleet[]): void;
        selectOtherFleets(fleets: Fleet[]): void;
        deselectFleet(fleet: Fleet): void;
        getMasterFleetForMerge(fleets: Fleet[]): Fleet;
        mergeFleetsOfSameType(fleets: Fleet[]): Fleet[];
        mergeFleets(): void;
        selectStar(star: Star): void;
        moveFleets(star: Star): void;
        splitFleet(fleet: Fleet): void;
        startReorganizingFleets(fleets: Fleet[]): void;
        endReorganizingFleets(): void;
        getCurrentAttackTargets(): IFleetAttackTarget[];
        attackTarget(target: IFleetAttackTarget): void;
    }
}
declare var tempCameraId: number;
declare namespace Rance {
    /**
     * @class Camera
     * @constructor
     */
    class Camera {
        tempCameraId: number;
        container: PIXI.Container;
        width: number;
        height: number;
        bounds: any;
        startPos: number[];
        startClick: number[];
        currZoom: number;
        screenWidth: number;
        screenHeight: number;
        toCenterOn: Point;
        onMoveCallbacks: {
            (x: number, y: number): void;
        }[];
        onZoomCallbacks: {
            (zoom: number): void;
        }[];
        listeners: {
            [name: string]: any;
        };
        resizeListener: any;
        /**
         * [constructor description]
         * @param {PIXI.Container} container [DOC the camera views and manipulates]
         * @param {number}                      bound     [How much of the container is allowed to leave the camera view.
         * 0.0 to 1.0]
         */
        constructor(container: PIXI.Container, bound: number);
        destroy(): void;
        /**
         * @method addEventListeners
         * @private
         */
        private addEventListeners();
        /**
         * @method setBound
         * @private
         */
        private setBounds();
        /**
         * @method startScroll
         * @param {number[]} mousePos [description]
         */
        startScroll(mousePos: number[]): void;
        /**
         * @method end
         */
        end(): void;
        /**
         * @method getDelta
         * @param {number[]} currPos [description]
         */
        private getDelta(currPos);
        /**
         * @method move
         * @param {number[]} currPos [description]
         */
        move(currPos: number[]): void;
        deltaMove(delta: number[]): void;
        private onMove();
        getScreenCenter(): {
            x: number;
            y: number;
        };
        getLocalPosition(position: Point): Point;
        getCenterPosition(): Point;
        centerOnPosition(pos: Point): void;
        /**
         * @method zoom
         * @param {number} zoomAmount [description]
         */
        zoom(zoomAmount: number): void;
        private onZoom();
        /**
         * @method deltaZoom
         * @param {number} delta [description]
         * @param {number} scale [description]
         */
        deltaZoom(delta: number, scale: number): void;
        /**
         * @method clampEdges
         * @private
         */
        private clampEdges();
    }
}
declare namespace Rance {
    class RectangleSelect {
        parentContainer: PIXI.Container;
        graphics: PIXI.Graphics;
        selecting: boolean;
        start: Point;
        current: Point;
        toSelectFrom: {
            position: Point;
            data: any;
        }[];
        getSelectionTargetsFN: () => {
            position: Point;
            data: any;
        }[];
        constructor(parentContainer: PIXI.Container);
        destroy(): void;
        addEventListeners(): void;
        startSelection(point: Point): void;
        moveSelection(point: Point): void;
        endSelection(point: Point): void;
        clearSelection(): void;
        drawSelectionRectangle(): void;
        setSelectionTargets(): void;
        getBounds(): {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
            width: number;
            height: number;
        };
        getAllInSelection(): any[];
        selectionContains(point: Point): boolean;
    }
}
declare namespace Rance {
    class MouseEventHandler {
        renderer: Renderer;
        camera: Camera;
        rectangleSelect: RectangleSelect;
        startPoint: number[];
        currPoint: number[];
        currentAction: string;
        stashedAction: string;
        hoveredStar: Star;
        preventingGhost: {
            [type: string]: any;
        };
        listeners: {
            [name: string]: any;
        };
        constructor(renderer: Renderer, camera: Camera);
        destroy(): void;
        addEventListeners(): void;
        preventGhost(delay: number, type: string): void;
        makeUITransparent(): void;
        makeUIOpaque(): void;
        cancelCurrentAction(): void;
        mouseDown(event: PIXI.interaction.InteractionEvent, star?: Star): void;
        touchStart(event: PIXI.interaction.InteractionEvent, star?: Star): void;
        touchEnd(event: PIXI.interaction.InteractionEvent): void;
        mouseMove(event: PIXI.interaction.InteractionEvent): void;
        mouseUp(event: PIXI.interaction.InteractionEvent): void;
        startScroll(event: PIXI.interaction.InteractionEvent): void;
        scrollMove(event: PIXI.interaction.InteractionEvent): void;
        endScroll(event: PIXI.interaction.InteractionEvent): void;
        zoomMove(event: PIXI.interaction.InteractionEvent): void;
        endZoom(event: PIXI.interaction.InteractionEvent): void;
        startZoom(event: PIXI.interaction.InteractionEvent): void;
        setHoveredStar(star: Star): void;
        clearHoveredStar(): void;
        startFleetMove(event: PIXI.interaction.InteractionEvent, star: Star): void;
        setFleetMoveTarget(star: Star): void;
        completeFleetMove(): void;
        clearFleetMoveTarget(): void;
        startSelect(event: PIXI.interaction.InteractionEvent): void;
        dragSelect(event: PIXI.interaction.InteractionEvent): void;
        endSelect(event: PIXI.interaction.InteractionEvent): void;
    }
}
declare namespace Rance {
    class UniformManager {
        registeredObjects: {
            [uniformType: string]: any[];
        };
        timeCount: number;
        constructor();
        registerObject(uniformType: string, shader: any): void;
        updateTime(): void;
    }
}
declare namespace Rance {
    namespace ShaderSources {
        var beam: string[];
        var blacktoalpha: string[];
        var guard: string[];
        var intersectingellipses: string[];
        var lightburst: string[];
        var nebula: string[];
        var occupation: string[];
        var shinyparticle: string[];
    }
}
declare namespace Rance {
    class NebulaFilter extends PIXI.AbstractFilter {
        constructor(uniforms: any);
    }
    class OccupationFilter extends PIXI.AbstractFilter {
        constructor(uniforms: any);
    }
    class GuardFilter extends PIXI.AbstractFilter {
        constructor(uniforms: any);
    }
    class ShaderManager {
        shaders: {
            [name: string]: PIXI.AbstractFilter;
        };
        uniformManager: UniformManager;
        constructor();
        initNebula(): void;
    }
}
declare namespace Rance {
    class PathfindingArrow {
        parentContainer: PIXI.Container;
        container: PIXI.Container;
        active: boolean;
        currentTarget: Star;
        clearTargetTimeout: any;
        selectedFleets: Fleet[];
        labelCache: {
            [style: string]: {
                [distance: number]: PIXI.Text;
            };
        };
        listeners: {
            [name: string]: any;
        };
        private curveStyles;
        constructor(parentContainer: PIXI.Container);
        destroy(): void;
        removeEventListener(name: string): void;
        removeEventListeners(): void;
        addEventListener(name: string, handler: Function): void;
        addEventListeners(): void;
        startMove(): void;
        setTarget(star: Star): void;
        clearTarget(): void;
        endMove(): void;
        clearArrows(): void;
        makeLabel(style: string, distance: number): void;
        getLabel(style: string, distance: number): PIXI.Text;
        getAllCurrentPaths(): {
            fleet: Fleet;
            path: any;
        }[];
        getAllCurrentCurves(): {
            style: string;
            curveData: number[][];
        }[];
        drawAllCurrentCurves(): void;
        getCurveData(points: Point[]): number[][];
        private drawCurve(points, style);
        drawArrowHead(gfx: PIXI.Graphics, color: number): void;
        getTargetOffset(target: Point, sourcePoint: Point, i: number, totalPaths: number, offsetPerOrbit: number): {
            x: number;
            y: number;
        };
    }
}
declare namespace Rance {
    class Renderer {
        stage: PIXI.Container;
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        pixiContainer: HTMLElement;
        layers: {
            [name: string]: PIXI.Container;
        };
        camera: Camera;
        mouseEventHandler: MouseEventHandler;
        shaderManager: ShaderManager;
        pathfindingArrow: PathfindingArrow;
        private activeRenderLoopId;
        isPaused: boolean;
        forceFrame: boolean;
        backgroundIsDirty: boolean;
        isBattleBackground: boolean;
        blurProps: number[];
        toCenterOn: Point;
        resizeListener: (e: Event) => void;
        galaxyMap: GalaxyMap;
        constructor(galaxyMap: GalaxyMap);
        init(): void;
        destroy(): void;
        removeRendererView(): void;
        bindRendererView(container: HTMLElement): void;
        initLayers(): void;
        setupDefaultLayers(): void;
        setupBackgroundLayers(): void;
        addCamera(): void;
        addEventListeners(): void;
        resize(): void;
        renderBackground(): void;
        renderBlurredBackground(x: number, y: number, width: number, height: number, seed: string): PIXI.Sprite;
        renderOnce(): void;
        pause(): void;
        resume(): void;
        render(renderLoopId?: number): void;
    }
}
declare namespace Rance {
    interface IModuleRuleSet {
        manufactory?: {
            startingCapacity?: number;
            maxCapacity?: number;
            buildCost?: number;
        };
        research?: {
            baseResearchSpeed?: number;
        };
        battle?: {
            rowsPerFormation?: number;
            cellsPerRow?: number;
            maxUnitsPerSide?: number;
            maxUnitsPerRow?: number;
            baseMaxCapturedUnits?: number;
            absoluteMaxCapturedUnits?: number;
            baseUnitCaptureChance?: number;
            humanUnitDeathChance?: number;
            aiUnitDeathChance?: number;
            independentUnitDeathChance?: number;
            loserUnitExtraDeathChance?: number;
        };
    }
    var defaultRuleSet: IModuleRuleSet;
}
declare namespace Rance {
    interface ITemplates {
        Abilities: {
            [type: string]: AbilityTemplate;
        };
        AttitudeModifiers: {
            [type: string]: AttitudeModifierTemplate;
        };
        BattleSFX: {
            [type: string]: BattleSFXTemplate;
        };
        Buildings: {
            [type: string]: BuildingTemplate;
        };
        Cultures: {
            [key: string]: CultureTemplate;
        };
        EffectActions: {
            [type: string]: EffectActionTemplate;
        };
        Items: {
            [type: string]: ItemTemplate;
        };
        MapGen: {
            [type: string]: MapGenTemplate;
        };
        MapRendererLayers: {
            [layerKey: string]: IMapRendererLayerTemplate;
        };
        MapRendererMapModes: {
            [mapModeKey: string]: IMapRendererMapModeTemplate;
        };
        Notifications: {
            [key: string]: NotificationTemplate;
        };
        Objectives: {
            [key: string]: ObjectiveTemplate;
        };
        PassiveSkills: {
            [type: string]: PassiveSkillTemplate;
        };
        Personalities: {
            [type: string]: IPersonality;
        };
        Resources: {
            [type: string]: ResourceTemplate;
        };
        StatusEffects: {
            [type: string]: StatusEffectTemplate;
        };
        SubEmblems: {
            [type: string]: SubEmblemTemplate;
        };
        Technologies: {
            [key: string]: TechnologyTemplate;
        };
        UnitArchetypes: {
            [type: string]: UnitArchetype;
        };
        UnitFamilies: {
            [type: string]: UnitFamily;
        };
        Units: {
            [type: string]: UnitTemplate;
        };
    }
    interface IModuleMetaData {
        name: string;
        version: string;
        author: string;
        description: string;
    }
    interface IModuleFile {
        key: string;
        metaData: IModuleMetaData;
        loadAssets: (callback: Function) => void;
        constructModule: (ModuleData: ModuleData) => ModuleData;
        ruleSet?: IModuleRuleSet;
    }
    class ModuleData {
        private subModuleMetaData;
        mapBackgroundDrawingFunction: (seed: string, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) => PIXI.DisplayObject;
        starBackgroundDrawingFunction: (seed: string, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) => PIXI.DisplayObject;
        mapRendererLayers: {
            [layerKey: string]: IMapRendererLayerTemplate;
        };
        mapRendererMapModes: {
            [mapModeKey: string]: IMapRendererMapModeTemplate;
        };
        Templates: ITemplates;
        defaultMap: MapGenTemplate;
        ruleSet: IModuleRuleSet;
        constructor();
        copyTemplates(source: any, category: string): void;
        copyAllTemplates(source: any): void;
        addSubModule(moduleFile: IModuleFile): void;
        getDefaultMap(): MapGenTemplate;
    }
}
declare namespace Rance {
    class ModuleLoader {
        moduleData: ModuleData;
        moduleFiles: {
            [index: string]: IModuleFile;
        };
        hasLoaded: {
            [index: string]: boolean;
        };
        moduleLoadStart: {
            [index: string]: number;
        };
        constructor();
        addModuleFile(moduleFile: IModuleFile): void;
        loadModuleFile(moduleFile: IModuleFile, afterLoaded: () => void): void;
        loadAll(afterLoaded: () => void): void;
        hasFinishedLoading(): boolean;
        finishLoadingModuleFile(moduleFile: IModuleFile, afterLoaded: () => void): void;
        constructModuleFile(moduleFile: IModuleFile): void;
        copyRuleSet(toCopy: IModuleRuleSet): void;
    }
}
declare namespace Rance {
    interface ISpriteSheetFrame {
        x: number;
        y: number;
        w: number;
        h: number;
    }
    interface ISpriteSheetData {
        frames: {
            [id: string]: {
                frame: ISpriteSheetFrame;
            };
        };
        meta: any;
    }
    function cacheSpriteSheetAsImages(sheetData: ISpriteSheetData, sheetImg: HTMLImageElement): void;
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            function drawNebula(seed: string, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer): PIXI.Sprite;
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace MapRendererLayers {
                var nonFillerStars: IMapRendererLayerTemplate;
                var starOwners: IMapRendererLayerTemplate;
                var fogOfWar: IMapRendererLayerTemplate;
                var starIncome: IMapRendererLayerTemplate;
                var playerInfluence: IMapRendererLayerTemplate;
                var nonFillerVoronoiLines: IMapRendererLayerTemplate;
                var ownerBorders: IMapRendererLayerTemplate;
                var starLinks: IMapRendererLayerTemplate;
                var resources: IMapRendererLayerTemplate;
                var fleets: IMapRendererLayerTemplate;
                var debugSectors: IMapRendererLayerTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace MapRendererMapModes {
                var defaultMapMode: IMapRendererMapModeTemplate;
                var noStatic: IMapRendererMapModeTemplate;
                var income: IMapRendererMapModeTemplate;
                var influence: IMapRendererMapModeTemplate;
                var resources: IMapRendererMapModeTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace MapGenCore {
        class Region {
            id: string;
            isFiller: boolean;
            stars: Star[];
            fillerPoints: FillerPoint[];
            constructor(id: string, isFiller: boolean);
            addStar(star: Star): void;
            addFillerPoint(point: FillerPoint): void;
            severLinksByQualifier(qualifierFN: (a: Star, b: Star) => boolean): void;
            severLinksToRegionsExcept(exemptRegions: Region[]): void;
        }
    }
}
declare namespace Rance {
    namespace MapGenCore {
        class Sector {
            id: number;
            stars: Star[];
            distributionFlags: string[];
            resourceType: ResourceTemplate;
            resourceLocation: Star;
            addedDistributables: Distributable[];
            constructor(id: number);
            addStar(star: Star): void;
            addResource(resource: ResourceTemplate): void;
            getNeighboringStars(): Star[];
            getNeighboringSectors(): Sector[];
            getMajorityRegions(): Region[];
            getPerimeterLengthWithStar(star: Star): number;
            setupIndependents(player: Player, intensity?: number, variance?: number): void;
        }
    }
}
declare namespace Rance {
    namespace MapGenCore {
        function linkAllStars(stars: Star[]): void;
        function partiallyCutLinks(stars: Star[], minConnections: number, maxCutsPerRegion: number): void;
        function calculateConnectedness(stars: Star[], maxRange: number): void;
        function makeSectors(stars: Star[], minSize: number, maxSize: number): {
            [sectorId: number]: Sector;
        };
        function setSectorDistributionFlags(sectors: Sector[]): void;
        function distributeDistributablesPerSector(sectors: Sector[], distributableType: string, allDistributables: any, placerFunction: (sector: Sector, distributable: Distributable) => void): void;
        function addDefenceBuildings(star: Star, amount?: number, addSectorCommand?: boolean): void;
        function setupPirates(player: Player): void;
        function severLinksToNonAdjacentStars(star: Star): void;
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace MapGenFunctions {
                function spiralGalaxyGeneration(options: MapGenOptionValues, players: Player[]): MapGenCore.MapGenResult;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace MapGen {
                    var spiralGalaxy: MapGenTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace MapGen {
                    var tinierSpiralGalaxy: MapGenTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Technologies {
                    var stealth: TechnologyTemplate;
                    var lasers: TechnologyTemplate;
                    var missiles: TechnologyTemplate;
                    var test1: TechnologyTemplate;
                    var test2: TechnologyTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace BattleSFXFunctions {
                function makeSFXFromVideo(videoSrc: string, onStartFN: (sprite: PIXI.Sprite) => void, props: Templates.SFXParams): void;
            }
        }
    }
}
declare namespace Rance {
    enum TargetFormation {
        ally = 0,
        enemy = 1,
        either = 2,
    }
    interface TargetRangeFunction {
        (units: Unit[][], user: Unit): Unit[];
    }
    var targetSelf: TargetRangeFunction;
    var targetNextRow: TargetRangeFunction;
    var targetAll: TargetRangeFunction;
    interface BattleAreaFunction {
        (units: Unit[][], target: number[]): Unit[];
    }
    var areaSingle: BattleAreaFunction;
    var areaAll: BattleAreaFunction;
    var areaColumn: BattleAreaFunction;
    var areaRow: BattleAreaFunction;
    var areaRowNeighbors: BattleAreaFunction;
    var areaNeighbors: BattleAreaFunction;
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace EffectActions {
                    var singleTargetDamage: EffectActionTemplate;
                    var closeAttack: EffectActionTemplate;
                    var wholeRowAttack: EffectActionTemplate;
                    var bombAttack: EffectActionTemplate;
                    var guardRow: EffectActionTemplate;
                    var receiveCounterAttack: EffectActionTemplate;
                    var increaseCaptureChance: EffectActionTemplate;
                    var buffTest: EffectActionTemplate;
                    var healTarget: EffectActionTemplate;
                    var healSelf: EffectActionTemplate;
                    var standBy: EffectActionTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace BattleSFXFunctions {
                function projectileAttack(props: {
                    projectileTextures: PIXI.Texture[];
                    impactTextures?: PIXI.Texture[][];
                    maxSpeed: number;
                    acceleration: number;
                    amountToSpawn: {
                        min: number;
                        max: number;
                    };
                    impactRate?: number;
                }, params: Templates.SFXParams): void;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace BattleSFXFunctions {
                function rocketAttack(params: Templates.SFXParams): void;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace BattleSFXFunctions {
                function guard(props: Templates.SFXParams): void;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            class ProtonWrapper {
                pixiRenderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
                container: PIXI.Container;
                proton: Proton;
                protonRenderer: Proton.Renderer;
                emitters: {
                    [key: string]: Proton.Emitter;
                };
                emitterKeysByID: {
                    [emitterId: string]: string;
                };
                onSpriteCreated: {
                    [key: string]: (sprite: PIXI.Sprite) => void;
                };
                constructor(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, container: PIXI.Container);
                destroy(): void;
                private initProtonRenderer();
                private onProtonParticleCreated(particle);
                private onProtonParticleUpdated(particle);
                private onProtonParticleDead(particle);
                private destroyEmitter(emitter);
                addEmitter(emitter: Proton.Emitter, key: string): void;
                private getEmitterKeyWithID(id);
                private getEmitterKey(emitter);
                removeEmitterWithKey(key: string): void;
                removeEmitter(emitter: Proton.Emitter): void;
                addInitializeToExistingParticles(emitter: Proton.Emitter, initialize: Proton.Initialize): void;
                update(): void;
            }
        }
    }
}
declare namespace Rance {
    type UniformValue = number | number[];
    type UniformsUpdaterFunction = (time: number) => {
        [key: string]: UniformValue;
    };
    interface IUniformTypesObject {
        [key: string]: string;
    }
    interface IUniformsObject {
        [uniformKey: string]: {
            type: string;
            value: UniformValue;
        };
    }
    class UniformSyncer {
        private uniformTypes;
        private uniforms;
        private updaterFunction;
        constructor(uniformTypes: IUniformTypesObject, updaterFunction: UniformsUpdaterFunction);
        private initUniforms(uniformTypes);
        sync(time: number): void;
        set(key: string, value: UniformValue): void;
        getUniformsObject(): IUniformsObject;
        makeClone(): UniformSyncer;
    }
}
declare namespace Rance {
    function drawEasingFunctionGraph(easingFunction: (x: number) => number): void;
    namespace Modules {
        namespace DefaultModule {
            namespace BattleSFXFunctions {
                class ShinyParticleFilter extends PIXI.AbstractFilter {
                    constructor(uniforms?: any);
                    static getUniformTypes(): IUniformTypesObject;
                }
                class LightBurstFilter extends PIXI.AbstractFilter {
                    constructor(uniforms?: any);
                    static getUniformTypes(): IUniformTypesObject;
                }
                class IntersectingEllipsesFilter extends PIXI.AbstractFilter {
                    constructor(uniforms?: any);
                    static getUniformTypes(): IUniformTypesObject;
                }
                class BeamFilter extends PIXI.AbstractFilter {
                    constructor(uniforms?: any);
                    static getUniformTypes(): IUniformTypesObject;
                }
                function particleTest(props: Templates.SFXParams): void;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            class BlackToAlphaFilter extends PIXI.AbstractFilter {
                constructor();
            }
            namespace Templates {
                namespace BattleSFX {
                    var rocketAttack: BattleSFXTemplate;
                    var guard: BattleSFXTemplate;
                    var particleTest: BattleSFXTemplate;
                    var videoTest: BattleSFXTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Abilities {
                    var rangedAttack: AbilityTemplate;
                    var closeAttack: AbilityTemplate;
                    var wholeRowAttack: AbilityTemplate;
                    var bombAttack: AbilityTemplate;
                    var guardRow: AbilityTemplate;
                    var guardColumn: AbilityTemplate;
                    var boardingHook: AbilityTemplate;
                    var debugAbility: AbilityTemplate;
                    var ranceAttack: AbilityTemplate;
                    var standBy: AbilityTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    interface IDiplomacyEvaluation {
        currentTurn: number;
        currentStatus: DiplomaticState;
        neighborStars: number;
        opinion: number;
    }
    enum AttitudeModifierFamily {
        geographic = 0,
        history = 1,
        current = 2,
    }
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace AttitudeModifiers {
                    var neighborStars: AttitudeModifierTemplate;
                    var atWar: AttitudeModifierTemplate;
                    var declaredWar: AttitudeModifierTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Buildings {
                    var sectorCommand: DefenceBuildingTemplate;
                    var sectorCommand1: DefenceBuildingTemplate;
                    var sectorCommand2: DefenceBuildingTemplate;
                    var starBase: DefenceBuildingTemplate;
                    var commercialPort: BuildingTemplate;
                    var deepSpaceRadar: BuildingTemplate;
                    var resourceMine: BuildingTemplate;
                    var reserachLab: BuildingTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Cultures {
                    var badassCulture: CultureTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace PassiveSkills {
                    var autoHeal: PassiveSkillTemplate;
                    var poisoned: PassiveSkillTemplate;
                    var overdrive: PassiveSkillTemplate;
                    var initialGuard: PassiveSkillTemplate;
                    var warpJammer: PassiveSkillTemplate;
                    var medic: PassiveSkillTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Items {
                    var bombLauncher1: ItemTemplate;
                    var bombLauncher2: ItemTemplate;
                    var bombLauncher3: ItemTemplate;
                    var afterBurner1: ItemTemplate;
                    var afterBurner2: ItemTemplate;
                    var afterBurner3: ItemTemplate;
                    var shieldPlating1: ItemTemplate;
                    var shieldPlating2: ItemTemplate;
                    var shieldPlating3: ItemTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace StatusEffects {
                    var test: StatusEffectTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace SubEmblems {
                    var Aguila_explayada_2: SubEmblemTemplate;
                    var Berliner_Baer: SubEmblemTemplate;
                    var Cles_en_sautoir: SubEmblemTemplate;
                    var Coa_Illustration_Cross_Bowen_3: SubEmblemTemplate;
                    var Coa_Illustration_Cross_Malte_1: SubEmblemTemplate;
                    var Coa_Illustration_Elements_Planet_Moon: SubEmblemTemplate;
                    var Couronne_heraldique_svg: SubEmblemTemplate;
                    var Gomaisasa: SubEmblemTemplate;
                    var Gryphon_Segreant: SubEmblemTemplate;
                    var Heraldic_pentacle: SubEmblemTemplate;
                    var Japanese_Crest_Futatsudomoe_1: SubEmblemTemplate;
                    var Japanese_Crest_Hana_Hisi: SubEmblemTemplate;
                    var Japanese_Crest_Mitsumori_Janome: SubEmblemTemplate;
                    var Japanese_Crest_Oda_ka: SubEmblemTemplate;
                    var Japanese_crest_Tsuki_ni_Hoshi: SubEmblemTemplate;
                    var Japanese_Crest_Ume: SubEmblemTemplate;
                    var Mitsuuroko: SubEmblemTemplate;
                    var Musubikashiwa: SubEmblemTemplate;
                    var Takeda_mon: SubEmblemTemplate;
                    var threeHorns: SubEmblemTemplate;
                    var Flag_of_Edward_England: SubEmblemTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace UnitArchetypes {
                    var combat: UnitArchetype;
                    var utility: UnitArchetype;
                    var scouting: UnitArchetype;
                    var defence: UnitArchetype;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace UnitFamilies {
                    var debug: UnitFamily;
                    var basic: UnitFamily;
                    var red: UnitFamily;
                    var blue: UnitFamily;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            var defaultUnitScene: UnitDrawingFunction;
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Templates {
                namespace Units {
                    var cheatShip: UnitTemplate;
                    var fighterSquadron: UnitTemplate;
                    var bomberSquadron: UnitTemplate;
                    var battleCruiser: UnitTemplate;
                    var scout: UnitTemplate;
                    var stealthShip: UnitTemplate;
                    var shieldBoat: UnitTemplate;
                    var commandShip: UnitTemplate;
                    var redShip: UnitTemplate;
                    var blueShip: UnitTemplate;
                }
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace AIUtils {
                interface IScoresByStar {
                    [starId: number]: {
                        star: Star;
                        score: number;
                    };
                }
                function moveToRoutine(front: MapAI.Front, afterMoveCallback: Function, getMoveTargetFN?: (fleet: Fleet) => Star): void;
                function independentTargetFilter(target: any): any;
                function buildingControllerFilter(target: any): boolean;
                function musterAndAttackRoutine(targetFilter: (target: any) => boolean, front: MapAI.Front, afterMoveCallback: () => void): void;
                function defaultUnitDesireFN(front: MapAI.Front): number;
                function defaultUnitFitFN(unit: Unit, front: MapAI.Front, lowHealthThreshhold?: number, healthAdjust?: number, distanceAdjust?: number): number;
                function scoutingUnitDesireFN(front: MapAI.Front): number;
                function scoutingUnitFitFN(unit: Unit, front: MapAI.Front): number;
                function mergeScoresByStar(merged: IScoresByStar, scores: {
                    star: Star;
                    score: number;
                }[]): IScoresByStar;
                function makeObjectivesFromScores(template: ObjectiveTemplate, evaluationScores: {
                    star?: Star;
                    player?: Player;
                    score: number;
                }[], basePriority: number): MapAI.Objective[];
                function perimeterObjectiveCreation(templateKey: string, isForScouting: boolean, basePriority: number, grandStrategyAI: MapAI.GrandStrategyAI, mapEvaluator: MapAI.MapEvaluator, objectivesAI: MapAI.ObjectivesAI): MapAI.Objective[];
                function getUnitsToBeatImmediateTarget(mapEvaluator: MapAI.MapEvaluator, objective: MapAI.Objective): {
                    min: number;
                    ideal: number;
                };
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var discovery: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var heal: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var expansion: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var cleanUpPirates: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var scoutingPerimeter: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var conquer: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var declareWar: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Objectives {
                var expandManufactoryCapacity: ObjectiveTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace UIComponents {
                var BattleFinishNotification: React.ClassicFactory<{}>;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Notifications {
                var battleFinishNotification: NotificationTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace UIComponents {
                var WarDeclarationNotification: React.ClassicFactory<{}>;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Notifications {
                var WarDeclarationNotification: NotificationTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace UIComponents {
                var PlayerDiedNotification: React.ClassicFactory<{}>;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            namespace Notifications {
                var playerDiedNotification: NotificationTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace DefaultModule {
            var moduleFile: IModuleFile;
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace PaintingPortraits {
            namespace Culture {
                var paintingPortraitsCulture: CultureTemplate;
            }
        }
    }
}
declare namespace Rance {
    namespace Modules {
        namespace PaintingPortraits {
            var moduleFile: IModuleFile;
        }
    }
}
declare namespace Rance {
    class GameLoader {
        map: GalaxyMap;
        humanPlayer: Player;
        players: Player[];
        independents: Player[];
        playersById: {
            [id: number]: Player;
        };
        starsById: {
            [id: number]: Star;
        };
        unitsById: {
            [id: number]: Unit;
        };
        buildingsByControllerId: {
            [id: number]: Building;
        };
        constructor();
        deserializeGame(data: IGameSaveData): Game;
        deserializeNotificationLog(data: INotificationLogSaveData | INotificationSaveData[]): NotificationLog;
        deserializeMap(data: IGalaxyMapSaveData): GalaxyMap;
        deserializeStar(data: IStarSaveData): Star;
        deserializeBuildings(data: IGalaxyMapSaveData): void;
        deserializeBuilding(data: IBuildingSaveData): Building;
        deserializePlayer(data: IPlayerSaveData): Player;
        deserializeDiplomacyStatus(player: Player, data: IDiplomacyStatusSaveData): void;
        deserializeIdentifiedUnits(player: Player, data: number[]): void;
        deserializeEmblem(emblemData: IEmblemSaveData, color: number): Emblem;
        deserializeFlag(data: IFlagSaveData): Flag;
        deserializeFleet(player: Player, data: IFleetSaveData): Fleet;
        deserializeUnit(data: IUnitSaveData): Unit;
        deserializeItem(data: IItemSaveData, player: Player): void;
    }
}
declare namespace Rance {
    function setAllDynamicTemplateProperties(): void;
}
declare namespace Rance {
    function buildTemplateIndexes(): void;
    namespace TemplateIndexes {
        var distributablesByDistributionGroup: {
            [groupName: string]: {
                unitFamilies: UnitFamily[];
                resources: ResourceTemplate[];
            };
        };
        var itemsByTechLevel: {
            [techLevel: number]: ItemTemplate[];
        };
    }
}
declare namespace Rance {
    function saveOptions(slot?: number): void;
    function loadOptions(slot?: number): void;
    interface IOptions {
        battleAnimationTiming: {
            before: number;
            effectDuration: number;
            after: number;
            unitEnter: number;
            unitExit: number;
        };
        debugMode: boolean;
        debugOptions: {
            battleSimulationDepth: number;
        };
        ui: {
            noHamburger: boolean;
        };
        display: {
            borderWidth: number;
        };
    }
    namespace defaultOptions {
        var battleAnimationTiming: {
            before: number;
            effectDuration: number;
            after: number;
            unitEnter: number;
            unitExit: number;
        };
        var debugMode: boolean;
        var debugOptions: {
            battleSimulationDepth: number;
        };
        var ui: {
            noHamburger: boolean;
        };
        var display: {
            borderWidth: number;
        };
    }
    var Options: IOptions;
}
declare namespace Rance {
    enum BattleSceneUnitState {
        entering = 0,
        stationary = 1,
        exiting = 2,
        removed = 3,
    }
    class BattleSceneUnit {
        container: PIXI.Container;
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        spriteContainer: PIXI.Container;
        activeUnit: Unit;
        unitState: BattleSceneUnitState;
        onFinishEnter: () => void;
        onFinishExit: () => void;
        tween: TWEEN.Tween;
        hasSFXSprite: boolean;
        getSceneBounds: () => {
            width: number;
            height: number;
        };
        constructor(container: PIXI.Container, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer);
        destroy(): void;
        private initLayers();
        changeActiveUnit(unit: Unit, afterChangedCallback?: () => void): void;
        setSFX(SFXTemplate: BattleSFXTemplate, user: Unit, target: Unit): void;
        resize(): void;
        private enterUnitSpriteWithoutAnimation(unit);
        private exitUnitSpriteWithoutAnimation();
        private enterUnitSprite(unit);
        private exitUnitSprite();
        private startUnitSpriteEnter(unit);
        private finishUnitSpriteEnter();
        private startUnitSpriteExit();
        private finishUnitSpriteExit();
        private getSFXParams(props);
        private setContainerPosition(positionOffScreen?);
        private setUnit(unit);
        private clearUnit();
        private makeUnitSprite(unit, SFXParams);
        private addUnitSprite(sprite);
        private clearUnitSprite();
        private setUnitSprite(unit);
        private clearTween();
        private makeEnterExitTween(direction, duration, onComplete);
        private setSFXSprite(spriteDrawingFN, duration);
    }
}
declare namespace Rance {
    class BattleSceneUnitOverlay {
        container: PIXI.Container;
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        overlayContainer: PIXI.Container;
        activeUnit: Unit;
        getSceneBounds: () => {
            width: number;
            height: number;
        };
        animationIsActive: boolean;
        onAnimationFinish: () => void;
        constructor(container: PIXI.Container, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer);
        destroy(): void;
        private initLayers();
        setSFX(SFXTemplate: BattleSFXTemplate, user: Unit, target: Unit): void;
        setOverlay(overlayFN: (props: Templates.SFXParams) => void, unit: Unit, duration: number): void;
        clearOverlay(): void;
        private getSFXParams(duration, triggerStart, triggerEnd?);
        private setContainerPosition();
        private addOverlay(overlay);
        private finishAnimation();
    }
}
declare namespace Rance {
    class BattleScene {
        container: PIXI.Container;
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        pixiContainer: HTMLElement;
        layers: {
            battleOverlay: PIXI.Container;
            side1Container: PIXI.Container;
            side2Container: PIXI.Container;
        };
        side1Unit: BattleSceneUnit;
        side2Unit: BattleSceneUnit;
        side1Overlay: BattleSceneUnitOverlay;
        side2Overlay: BattleSceneUnitOverlay;
        activeSFX: BattleSFXTemplate;
        targetUnit: Unit;
        userUnit: Unit;
        activeUnit: Unit;
        hoveredUnit: Unit;
        side1UnitHasFinishedUpdating: boolean;
        side2UnitHasFinishedUpdating: boolean;
        afterUnitsHaveFinishedUpdatingCallback: () => void;
        beforeUseDelayHasFinishedCallback: () => void;
        activeSFXHasFinishedCallback: () => void;
        afterUseDelayHasFinishedCallback: () => void;
        abilityUseHasFinishedCallback: () => void;
        triggerEffectCallback: () => void;
        isPaused: boolean;
        forceFrame: boolean;
        resizeListener: (e: Event) => void;
        constructor(pixiContainer: HTMLElement);
        destroy(): void;
        private initLayers();
        private handleResize();
        private getSceneBounds();
        private getSFXParams(props);
        private getHighestPriorityUnitForSide(side);
        private haveBothUnitsFinishedUpdating();
        private executeIfBothUnitsHaveFinishedUpdating();
        private finishUpdatingUnit(side);
        handleAbilityUse(props: {
            SFXTemplate: BattleSFXTemplate;
            triggerEffectCallback: () => void;
            user: Unit;
            target: Unit;
            afterFinishedCallback: () => void;
        }): void;
        private executeBeforeUseDelayHasFinishedCallback();
        private executeTriggerEffectCallback();
        private executeActiveSFXHasFinishedCallback();
        private executeAfterUseDelayHasFinishedCallback();
        private executeAbilityUseHasFinishedCallback();
        private prepareSFX();
        private playSFX();
        private handleActiveSFXEnd();
        private cleanUpAfterSFX();
        updateUnits(afterFinishedUpdatingCallback?: () => void): void;
        clearActiveSFX(): void;
        private triggerSFXStart(SFXTemplate, user, target, afterFinishedCallback?);
        private makeBattleOverlay(afterFinishedCallback?);
        private addBattleOverlay(overlay);
        private clearBattleOverlay();
        private clearUnitOverlays();
        private getBattleSceneUnit(unit);
        private getBattleSceneUnitOverlay(unit);
        renderOnce(): void;
        pause(): void;
        resume(): void;
        private render(timeStamp?);
    }
}
declare namespace Rance {
    function getNullFormation(): Unit[][];
    function getFormationsToTarget(battle: Battle, user: Unit, effect: EffectActionTemplate): Unit[][];
    function getTargetsForAllAbilities(battle: Battle, user: Unit): {
        [id: number]: AbilityTemplate[];
    };
}
declare namespace Rance {
    interface IAbilityUseData {
        ability: AbilityTemplate;
        user: Unit;
        intendedTarget: Unit;
        actualTarget?: Unit;
    }
    interface IAbilityEffectData {
        templateEffect: AbilityEffectTemplate;
        user: Unit;
        target: Unit;
        trigger: (user: Unit, target: Unit) => boolean;
    }
    interface IAbilityEffectDataByPhase {
        beforeUse: IAbilityEffectData[];
        abilityEffects: IAbilityEffectData[];
        afterUse: IAbilityEffectData[];
    }
    function getAbilityEffectDataByPhase(battle: Battle, abilityUseData: IAbilityUseData): IAbilityEffectDataByPhase;
}
declare namespace Rance {
    interface IUnitDisplayData {
        health: number;
        guardAmount: number;
        guardType: GuardCoverage;
        actionPoints: number;
        isPreparing: boolean;
        isAnnihilated: boolean;
    }
    interface IUnitDisplayDataById {
        [unitId: number]: IUnitDisplayData;
    }
    interface IAbilityUseEffect {
        actionName: string;
        unitDisplayDataAfterUsingById: IUnitDisplayDataById;
        sfx: BattleSFXTemplate;
        sfxUser: Unit;
        sfxTarget: Unit;
    }
    function useAbility(battle: Battle, ability: AbilityTemplate, user: Unit, target: Unit, getEffects: boolean): IAbilityUseEffect[];
}
declare namespace Rance {
    var idGenerators: {
        fleet: number;
        item: number;
        player: number;
        star: number;
        unit: number;
        building: number;
        objective: number;
    };
    class App {
        seed: string;
        renderer: Renderer;
        game: Game;
        mapRenderer: MapRenderer;
        reactUI: ReactUI;
        humanPlayer: Player;
        playerControl: PlayerControl;
        images: {
            [id: string]: HTMLImageElement;
        };
        moduleData: ModuleData;
        moduleLoader: ModuleLoader;
        constructor();
        makeApp(): void;
        destroy(): void;
        load(saveKey: string): void;
        makeGameFromSetup(map: GalaxyMap, players: Player[]): void;
        makeGame(): Game;
        makePlayers(): {
            players: Player[];
        };
        makeMap(playerData: {
            players: Player[];
        }): GalaxyMap;
        initGame(): void;
        initDisplay(): void;
        initUI(): void;
        hookUI(): void;
        setInitialScene(): void;
    }
}
declare var app: App;
