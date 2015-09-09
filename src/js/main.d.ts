/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../data/templates/spritetemplate.d.ts" />
/// <reference path="../../lib/husl.d.ts" />
/// <reference path="../../lib/rng.d.ts" />
/// <reference path="../../lib/voronoi.d.ts" />
/// <reference path="../../lib/quadtree.d.ts" />
/// <reference path="../../lib/offset.d.ts" />
/// <reference path="../../data/tutorials/tutorial.d.ts" />
declare class EventEmitter3 extends PIXI.EventEmitter {
}
declare module Rance {
    var eventEmitter: EventEmitter3;
    var eventManager: {
        dispatchEvent: any;
        removeEventListener: any;
        removeAllListeners: any;
        addEventListener: (eventType: string, listener: Function) => Function;
    };
}
declare module Rance {
    module UIComponents {
        var UnitStrength: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitActions: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitStatus: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitInfo: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitIcon: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitStatusEffects: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var Draggable: {
            getDefaultProps: () => {
                dragThreshhold: number;
            };
            getInitialState: () => {
                mouseDown: boolean;
                dragging: boolean;
                dragOffset: {
                    x: number;
                    y: number;
                };
                mouseDownPosition: {
                    x: number;
                    y: number;
                };
                originPosition: {
                    x: number;
                    y: number;
                };
                clone: Node;
            };
            handleMouseDown: (e: MouseEvent) => void;
            handleMouseMove: (e: MouseEvent) => void;
            handleDrag: (e: MouseEvent) => void;
            handleMouseUp: (e: MouseEvent) => void;
            handleDragEnd: (e: MouseEvent) => void;
            addEventListeners: () => void;
            removeEventListeners: () => void;
            componentDidMount: () => void;
            componentWillUnmount: () => void;
        };
    }
}
declare module Rance {
    module UIComponents {
        var Unit: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var EmptyUnit: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var DropTarget: {
            componentDidMount: () => void;
            componentWillUnmount: () => void;
        };
    }
}
declare module Rance {
    module UIComponents {
        var UnitWrapper: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetColumn: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var Fleet: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TurnCounter: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var TurnOrder: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var AbilityTooltip: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleScore: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleSceneUnit: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleScene: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleDisplayStrength: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleBackground: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var Battle: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var SplitMultilineText: {
            splitMultilineText: (text: any) => any;
        };
    }
}
declare module Rance {
    module UIComponents {
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
        var List: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitListItem: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemListItem: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var AbilityList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitItem: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitItemWrapper: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var MenuUnitInfo: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemEquip: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var DefenceBuilding: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var DefenceBuildingList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleInfo: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BattlePrep: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var LightBox: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemPurchaseListItem: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemPurchaseList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BuyItems: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var PopupResizeHandle: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var Popup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TutorialPopup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ConfirmPopup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var PopupManager: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var SaveListItem: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var SaveList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var SaveGame: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var LoadGame: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var DiplomacyActions: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
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
declare module Rance {
    module UIComponents {
        var AttitudeModifierInfo: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var AttitudeModifierList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var Opinion: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var DiplomaticStatusPlayer: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var DiplomacyOverview: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var EconomySummaryItem: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var EconomySummary: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var OptionsGroup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var OptionsCheckbox: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var OptionsList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TopMenu: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var Resource: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TopBarResources: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TopBar: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetControls: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetInfo: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ShipInfoName: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ShipInfo: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetContents: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetReorganization: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetSelection: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var StarInfo: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var AttackTarget: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableBuilding: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableBuildingList: React.Factory<{}>;
    }
}
declare module Rance {
    function randInt(min: number, max: number): number;
    function randRange(min: number, max: number): number;
    function getRandomArrayKey(target: any[]): number;
    function getRandomArrayItem(target: any[]): any;
    function getRandomKey(target: {
        [props: string]: any;
    }): string;
    function getObjectKeysSortedByValue(obj: {
        [key: string]: number;
    }, order: string): string[];
    function getRandomProperty(target: {
        [props: string]: any;
    }): any;
    function getRandomPropertyWithWeights(target: {
        [prop: string]: number;
    }): any;
    function getFrom2dArray(target: any[][], arr: number[][]): any[];
    function flatten2dArray(toFlatten: any[][]): any[];
    function reverseSide(side: string): string;
    function turnOrderSortFunction(a: Unit, b: Unit): number;
    function rectContains(rect: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }, point: Point): boolean;
    function hexToString(hex: number): string;
    function stringToHex(text: string): number;
    function colorImageInPlayerColor(image: HTMLImageElement, player: Player): string;
    function extendObject(from: any, to?: any): any;
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
}
declare module Rance {
    interface TargetingFunction {
        (units: Unit[][], target: number[]): Unit[];
    }
    var targetSingle: TargetingFunction;
    var targetAll: TargetingFunction;
    var targetRow: TargetingFunction;
    var targetColumn: TargetingFunction;
    var targetColumnNeighbors: TargetingFunction;
    var targetNeighbors: TargetingFunction;
}
declare module Rance {
    enum DamageType {
        physical = 0,
        magical = 1,
    }
}
declare module Rance {
    module Templates {
        interface IEffectTemplate {
            name: string;
            targetFleets: string;
            targetingFunction: TargetingFunction;
            targetRange: string;
            effect: (user: Unit, target: Unit, data?: any) => void;
        }
        module Effects {
            var dummyTargetColumn: IEffectTemplate;
            var dummyTargetAll: IEffectTemplate;
            var singleTargetDamage: IEffectTemplate;
            var closeAttack: IEffectTemplate;
            var wholeRowAttack: IEffectTemplate;
            var bombAttack: IEffectTemplate;
            var guardColumn: IEffectTemplate;
            var receiveCounterAttack: IEffectTemplate;
            var increaseCaptureChance: IEffectTemplate;
            var buffTest: IEffectTemplate;
            var healTarget: IEffectTemplate;
            var healSelf: IEffectTemplate;
            var standBy: IEffectTemplate;
        }
    }
}
declare module Rance {
    module BattleSFX {
        function makeSprite(imgSrc: string, props: Templates.SFXParams): HTMLCanvasElement;
        function makeVideo(videoSrc: string, props: Templates.SFXParams): HTMLCanvasElement;
    }
}
declare module Rance {
    module BattleSFX {
        function rocketAttack(props: Templates.SFXParams): HTMLCanvasElement;
    }
}
declare module Rance {
    module Templates {
        interface SFXParams {
            user: Unit;
            width: number;
            height: number;
            duration: number;
            facingRight: boolean;
            onLoaded: (canvas: HTMLCanvasElement) => void;
        }
        interface IBattleEffectSFX {
            duration: number;
            userSprite?: (props: SFXParams) => HTMLCanvasElement;
            userOverlay?: (props: SFXParams) => HTMLCanvasElement;
            battleOverlay?: (props: SFXParams) => HTMLCanvasElement;
        }
    }
}
declare module Rance {
    module Templates {
        interface IAbilityTemplateEffect {
            template: IEffectTemplate;
            data?: any;
            attachedEffects?: IAbilityTemplateEffect[];
            sfx?: IBattleEffectSFX;
        }
        interface IAbilityTemplate {
            type: string;
            displayName: string;
            description: string;
            moveDelay: number;
            preparation?: {
                turnsToPrep: number;
                prepDelay: number;
                interruptsNeeded: number;
            };
            actionsUse: number;
            byPassesGuard?: boolean;
            mainEffect: IAbilityTemplateEffect;
            secondaryEffects?: IAbilityTemplateEffect[];
            beforeUse?: IAbilityTemplateEffect[];
            afterUse?: IAbilityTemplateEffect[];
            AIEvaluationPriority?: number;
            AIScoreAdjust?: number;
            disableInAIBattles?: boolean;
            addsGuard?: boolean;
        }
        module Abilities {
            var dummyTargetColumn: IAbilityTemplate;
            var dummyTargetAll: IAbilityTemplate;
            var rangedAttack: IAbilityTemplate;
            var closeAttack: IAbilityTemplate;
            var wholeRowAttack: IAbilityTemplate;
            var bombAttack: IAbilityTemplate;
            var guardColumn: IAbilityTemplate;
            var boardingHook: IAbilityTemplate;
            var debugAbility: IAbilityTemplate;
            var ranceAttack: IAbilityTemplate;
            var standBy: IAbilityTemplate;
        }
    }
}
declare module Rance {
    module Templates {
        interface ITurnStartEffect {
            (unit: Unit): void;
        }
        interface IBattlePrepEffect {
            (unit: Unit, battlePrep: BattlePrep): void;
        }
        interface IPassiveSkillTemplate {
            type: string;
            displayName: string;
            description: string;
            isHidden?: boolean;
            atBattleStart?: IAbilityTemplateEffect[];
            beforeAbilityUse?: IAbilityTemplateEffect[];
            afterAbilityUse?: IAbilityTemplateEffect[];
            atTurnStart?: ITurnStartEffect[];
            inBattlePrep?: IBattlePrepEffect[];
        }
        module PassiveSkills {
            var autoHeal: IPassiveSkillTemplate;
            var poisoned: IPassiveSkillTemplate;
            var overdrive: IPassiveSkillTemplate;
            var initialGuard: IPassiveSkillTemplate;
            var warpJammer: IPassiveSkillTemplate;
            var medic: IPassiveSkillTemplate;
        }
    }
}
declare module Rance {
    module Templates {
        interface IUnitTemplate {
            type: string;
            archetype: string;
            displayName: string;
            sprite: ISpriteTemplate;
            isSquadron: boolean;
            buildCost: number;
            icon: string;
            maxHealth: number;
            maxMovePoints: number;
            visionRange: number;
            detectionRange: number;
            isStealthy?: boolean;
            attributeLevels: {
                attack: number;
                defence: number;
                intelligence: number;
                speed: number;
            };
            abilities: IAbilityTemplate[];
            passiveSkills?: IPassiveSkillTemplate[];
        }
        module ShipTypes {
            var cheatShip: IUnitTemplate;
            var fighterSquadron: IUnitTemplate;
            var bomberSquadron: IUnitTemplate;
            var battleCruiser: IUnitTemplate;
            var scout: IUnitTemplate;
            var stealthShip: IUnitTemplate;
            var shieldBoat: IUnitTemplate;
        }
    }
}
declare module Rance {
    interface IUnitAttributes {
        maxActionPoints: number;
        attack: number;
        defence: number;
        intelligence: number;
        speed: number;
    }
}
declare module Rance {
    module Templates {
        interface IResourceTemplate {
            type: string;
            displayName: string;
            icon: string;
            rarity: number;
            distributionGroups: string[];
        }
        module Resources {
            var testResource1: IResourceTemplate;
            var testResource2: IResourceTemplate;
            var testResource3: IResourceTemplate;
            var testResource4: IResourceTemplate;
            var testResource5: IResourceTemplate;
        }
    }
}
declare module Rance {
    interface Point {
        x: number;
        y: number;
    }
}
declare module Rance {
    module Templates {
        interface IBuildingTemplate {
            type: string;
            category: string;
            name: string;
            iconSrc: string;
            buildCost: number;
            family?: string;
            maxPerType: number;
            maxUpgradeLevel: number;
            upgradeOnly?: boolean;
            upgradeInto?: {
                templateType: string;
                level: number;
            }[];
        }
        interface IDefenceBuildingTemplate extends IBuildingTemplate {
            defenderAdvantage: number;
        }
        module Buildings {
            var sectorCommand: IDefenceBuildingTemplate;
            var sectorCommand1: IDefenceBuildingTemplate;
            var sectorCommand2: IDefenceBuildingTemplate;
            var starBase: IDefenceBuildingTemplate;
            var commercialPort: IBuildingTemplate;
            var deepSpaceRadar: IBuildingTemplate;
            var itemManufactory: IBuildingTemplate;
            var resourceMine: IBuildingTemplate;
        }
    }
}
declare module Rance {
    interface IBuildingUpgradeData {
        template: Templates.IBuildingTemplate;
        level: number;
        cost: number;
        parentBuilding: Building;
    }
    class Building {
        template: Templates.IBuildingTemplate;
        id: number;
        location: Star;
        controller: Player;
        upgradeLevel: number;
        totalCost: number;
        constructor(props: {
            template: Templates.IBuildingTemplate;
            location: Star;
            controller?: Player;
            upgradeLevel?: number;
            totalCost?: number;
            id?: number;
        });
        getPossibleUpgrades(): IBuildingUpgradeData[];
        upgrade(): void;
        setController(newController: Player): void;
        serialize(): any;
    }
}
declare module Rance {
    module Templates {
        interface IItemTemplate {
            type: string;
            displayName: string;
            description?: string;
            icon: string;
            techLevel: number;
            slot: string;
            cost: number;
            ability?: IAbilityTemplate;
            passiveSkill?: IPassiveSkillTemplate;
            attributes?: {
                maxActionPoints?: number;
                attack?: number;
                defence?: number;
                intelligence?: number;
                speed?: number;
            };
        }
        module Items {
            var bombLauncher1: IItemTemplate;
            var bombLauncher2: IItemTemplate;
            var bombLauncher3: IItemTemplate;
            var afterBurner1: IItemTemplate;
            var afterBurner2: IItemTemplate;
            var afterBurner3: IItemTemplate;
            var shieldPlating1: IItemTemplate;
            var shieldPlating2: IItemTemplate;
            var shieldPlating3: IItemTemplate;
        }
    }
}
declare module Rance {
    class Item {
        id: number;
        template: Templates.IItemTemplate;
        unit: Unit;
        constructor(template: Templates.IItemTemplate, id?: number);
        serialize(): any;
    }
}
declare module Rance {
    class ItemGenerator {
        itemsByTechLevel: {
            [techLevel: number]: Templates.IItemTemplate[];
        };
        constructor();
        indexItemsByTechLevel(): void;
    }
}
declare module Rance {
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
        resource: Templates.IResourceTemplate;
        fleets: {
            [playerId: string]: Fleet[];
        };
        buildings: {
            [category: string]: Building[];
        };
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
        buildableItems: {
            1: Templates.IItemTemplate[];
            2: Templates.IItemTemplate[];
            3: Templates.IItemTemplate[];
        };
        constructor(x: number, y: number, id?: number);
        severLinksToNonAdjacent(): void;
        addBuilding(building: Building): void;
        removeBuilding(building: Building): void;
        sortDefenceBuildings(): void;
        getSecondaryController(): Player;
        updateController(): void;
        getIncome(): number;
        getResourceIncome(): {
            resource: Templates.IResourceTemplate;
            amount: number;
        };
        getAllBuildings(): Building[];
        getBuildingsForPlayer(player: Player): Building[];
        getBuildingsByFamily(buildingTemplate: Templates.IBuildingTemplate): Building[];
        getBuildableBuildings(): Templates.IBuildingTemplate[];
        getBuildingUpgrades(): {
            [buildingId: number]: {
                template: Templates.IBuildingTemplate;
                level: number;
                cost: number;
                parentBuilding: Building;
            }[];
        };
        getBuildableShipTypes(): Templates.IUnitTemplate[];
        getAllFleets(): Fleet[];
        getFleetIndex(fleet: Fleet): number;
        hasFleet(fleet: Fleet): boolean;
        addFleet(fleet: Fleet): boolean;
        addFleets(fleets: Fleet[]): void;
        removeFleet(fleet: Fleet): boolean;
        removeFleets(fleets: Fleet[]): void;
        getAllShipsOfPlayer(player: Player): Unit[];
        getIndependentShips(): Unit[];
        getTargetsForPlayer(player: Player): {
            type: string;
            enemy: Player;
            building: Building;
            ships: Unit[];
        }[];
        getFirstEnemyDefenceBuilding(player: Player): Building;
        getEnemyFleetOwners(player: Player, excludedTarget?: Player): Player[];
        setPosition(x: number, y: number): void;
        setResource(resource: Templates.IResourceTemplate): void;
        hasLink(linkTo: Star): boolean;
        addLink(linkTo: Star): void;
        removeLink(linkTo: Star): void;
        getAllLinks(): Star[];
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
        getSeed(): string;
        seedBuildableItems(): void;
        getItemManufactoryLevel(): number;
        getItemAmountForTechLevel(techLevel: number, manufactoryLevel: number): number;
        getBuildableItems(): {
            byTechLevel: {
                [techLevel: number]: Templates.IItemTemplate[];
            };
            all: Templates.IItemTemplate[];
        };
        serialize(): any;
    }
}
declare module Rance {
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
declare module Rance {
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
declare module Rance {
    class Fleet {
        player: Player;
        ships: Unit[];
        location: Star;
        visionIsDirty: boolean;
        visibleStars: Star[];
        detectedStars: Star[];
        isStealthy: boolean;
        id: number;
        name: string;
        constructor(player: Player, ships: Unit[], location: Star, id?: number, shouldRender?: boolean);
        getShipIndex(ship: Unit): number;
        hasShip(ship: Unit): boolean;
        deleteFleet(shouldRender?: boolean): void;
        mergeWith(fleet: Fleet, shouldRender?: boolean): void;
        addShip(ship: Unit): boolean;
        addShips(ships: Unit[]): void;
        removeShip(ship: Unit): boolean;
        removeShips(ships: Unit[]): void;
        transferShip(fleet: Fleet, ship: Unit): boolean;
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
        serialize(): any;
    }
}
declare module Rance {
    module Templates {
        interface ISubEmblemTemplate {
            type: string;
            position: string;
            foregroundOnly: boolean;
            imageSrc: string;
        }
        module SubEmblems {
            var emblem0: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem33: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem34: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem35: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem36: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem37: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem38: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem39: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem40: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem41: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem42: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem43: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem44: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem45: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem46: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem47: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem48: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem49: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem50: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem51: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem52: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem53: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem54: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem55: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem56: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem57: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem58: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem59: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem61: {
                type: string;
                position: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
        }
    }
}
declare module Rance {
    interface IRange {
        min?: number;
        max?: number;
        step?: number;
        defaultValue?: number;
    }
}
declare module Rance {
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
declare module Rance {
    class Emblem {
        alpha: number;
        color: number;
        inner: Templates.ISubEmblemTemplate;
        outer: Templates.ISubEmblemTemplate;
        constructor(color: number, alpha?: number, inner?: Templates.ISubEmblemTemplate, outer?: Templates.ISubEmblemTemplate);
        isForegroundOnly(): boolean;
        generateRandom(minAlpha: number, rng?: any): void;
        generateSubEmblems(rng: any): void;
        draw(): HTMLCanvasElement;
        drawSubEmblem(toDraw: Templates.ISubEmblemTemplate): HTMLCanvasElement;
        serialize(): any;
    }
}
declare module Rance {
    class Flag {
        width: number;
        height: number;
        mainColor: number;
        secondaryColor: number;
        tetriaryColor: number;
        backgroundEmblem: Emblem;
        foregroundEmblem: Emblem;
        customImage: string;
        private _customImageToRender;
        seed: any;
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
        draw(): HTMLCanvasElement;
        serialize(): any;
    }
}
declare module Rance {
    interface IMove {
        ability: Templates.IAbilityTemplate;
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
        constructor(battle: Battle, sideId: string, move?: IMove);
        getPossibleMoves(): IMove[];
        addChild(): MCTreeNode;
        updateResult(result: number): void;
        pickRandomAbilityAndTarget(actions: {
            [targetId: number]: Templates.IAbilityTemplate[];
        }): {
            targetId: any;
            abilityType: any;
        };
        simulateOnce(battle: Battle): void;
        simulateToEnd(): void;
        clearResult(): void;
        setUct(): void;
        getHighestUctChild(): MCTreeNode;
        getRecursiveBestUctChild(): MCTreeNode;
    }
}
declare module Rance {
    class MCTree {
        rootNode: MCTreeNode;
        constructor(battle: Battle, sideId: string);
        sortByWinRateFN(a: MCTreeNode, b: MCTreeNode): number;
        sortByScoreFN(a: MCTreeNode, b: MCTreeNode): number;
        evaluate(iterations: number): MCTreeNode;
        printToConsole(nodes: MCTreeNode[]): void;
    }
}
declare module Rance {
    class BattleSimulator {
        battle: Battle;
        constructor(battle: Battle);
        simulateBattle(): void;
        simulateMove(): void;
        simulateAbility(ability: Templates.IAbilityTemplate, target: Unit): void;
        getBattleEndData(): void;
        finishBattle(): void;
    }
}
declare module Rance {
    class BattlePrep {
        attacker: Player;
        defender: Player;
        battleData: IBattleData;
        attackerFormation: Unit[][];
        defenderFormation: Unit[][];
        availableUnits: Unit[];
        playerFormation: Unit[][];
        humanPlayer: Player;
        enemyFormation: Unit[][];
        enemyPlayer: Player;
        alreadyPlaced: {
            [id: number]: number[];
        };
        minDefendersInNeutralTerritory: number;
        constructor(battleData: IBattleData);
        resetBattleStats(): void;
        triggerPassiveSkills(): void;
        makeEmptyFormation(): Unit[][];
        makeAIFormations(): void;
        setupPlayer(): void;
        makeAIFormation(units: Unit[]): Unit[][];
        getUnitPosition(unit: Unit): number[];
        getUnitAtPosition(position: number[]): Unit;
        clearPlayerFormation(): void;
        setupPlayerFormation(formation: Unit[][]): void;
        setUnit(unit: Unit, position: number[]): void;
        swapUnits(unit1: Unit, unit2: Unit): void;
        removeUnit(unit: Unit): void;
        humanFormationIsValid(): boolean;
        forEachShipInFormation(formation: Unit[][], operator: (unit: Unit) => any): void;
        makeBattle(): Battle;
    }
}
declare module Rance {
    interface IDiplomacyEvaluation {
        currentTurn: number;
        currentStatus: DiplomaticState;
        neighborStars: number;
        opinion: number;
    }
    module Templates {
        enum AttitudeModifierFamily {
            geographic = 0,
            history = 1,
            current = 2,
        }
        interface IAttitudeModifierTemplate {
            type: string;
            displayName: string;
            family: AttitudeModifierFamily;
            duration: number;
            canBeOverriddenBy?: IAttitudeModifierTemplate[];
            triggeredOnly?: boolean;
            startCondition?: (evaluation: IDiplomacyEvaluation) => boolean;
            endCondition?: (evaluation: IDiplomacyEvaluation) => boolean;
            constantEffect?: number;
            getEffectFromEvaluation?: (evaluation: IDiplomacyEvaluation) => number;
            canOverride?: IAttitudeModifierTemplate[];
        }
        module AttitudeModifiers {
            var neighborStars: IAttitudeModifierTemplate;
            var atWar: IAttitudeModifierTemplate;
            var declaredWar: IAttitudeModifierTemplate;
        }
    }
}
declare module Rance {
    class AttitudeModifier {
        template: Templates.IAttitudeModifierTemplate;
        startTurn: number;
        endTurn: number;
        currentTurn: number;
        strength: number;
        isOverRidden: boolean;
        constructor(props: {
            template: Templates.IAttitudeModifierTemplate;
            startTurn: number;
            endTurn?: number;
            strength?: number;
        });
        setStrength(evaluation: IDiplomacyEvaluation): number;
        getFreshness(currentTurn?: number): number;
        getAdjustedStrength(currentTurn?: number): number;
        hasExpired(currentTurn?: number): boolean;
        shouldEnd(evaluation: IDiplomacyEvaluation): boolean;
        serialize(): any;
    }
}
declare module Rance {
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
        constructor(player: Player);
        getBaseOpinion(): number;
        updateAttitudes(): void;
        handleDiplomaticStatusUpdate(): void;
        getOpinionOf(player: Player): number;
        meetPlayer(player: Player): void;
        canDeclareWarOn(player: Player): boolean;
        canMakePeaceWith(player: Player): boolean;
        declareWarOn(player: Player): void;
        makePeaceWith(player: Player): void;
        canAttackFleetOfPlayer(player: Player): boolean;
        canAttackBuildingOfPlayer(player: Player): boolean;
        hasModifierOfSameType(player: Player, modifier: AttitudeModifier): boolean;
        addAttitudeModifier(player: Player, modifier: AttitudeModifier): void;
        processAttitudeModifiersForPlayer(player: Player, evaluation: IDiplomacyEvaluation): void;
        serialize(): any;
    }
}
declare module Rance {
    interface IPersonalityData {
        expansiveness: number;
        aggressiveness: number;
        friendliness: number;
        unitCompositionPreference: {
            [archetype: string]: number;
        };
    }
    function makeRandomPersonality(): IPersonalityData;
    module Templates {
        module Personalities {
            var testPersonality1: IPersonalityData;
        }
    }
}
declare module Rance {
    class MapVoronoiInfo {
        treeMap: any;
        diagram: any;
        nonFillerLines: {
            [visibility: string]: any[];
        };
        constructor();
        getNonFillerVoronoiLines(visibleStars?: Star[]): any[];
        getStarAtPoint(point: Point): any;
    }
}
declare module Rance {
    class FillerPoint implements Point {
        x: number;
        y: number;
        mapGenData: any;
        voronoiCell: any;
        voronoiId: number;
        constructor(x: number, y: number);
        setPosition(x: number, y: number): void;
        serialize(): {
            x: number;
            y: number;
        };
    }
}
declare module Rance {
    module MapGen2 {
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
declare module Rance {
    module MapGen2 {
        function triangulate(vertices: Point[]): Triangle[];
        function getCentroid(vertices: Point[]): Point;
        function pointsEqual(p1: Point, p2: Point): boolean;
    }
}
declare module Rance {
    module MapGen2 {
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
declare module Rance {
    module MapGen2 {
        class MapGenResult {
            stars: Star[];
            fillerPoints: FillerPoint[];
            width: number;
            height: number;
            voronoiInfo: MapVoronoiInfo;
            constructor(props: {
                stars: Star[];
                fillerPoints: FillerPoint[];
                width: number;
                height: number;
            });
            getAllPoints(): Point[];
            makeMap(): GalaxyMap;
            makeVoronoiInfo(): MapVoronoiInfo;
            makeVoronoiTreeMap(): any;
            clearMapGenData(): void;
        }
    }
}
declare module Rance {
    class Game {
        turnNumber: number;
        independents: Player[];
        playerOrder: Player[];
        galaxyMap: GalaxyMap;
        humanPlayer: Player;
        activePlayer: Player;
        gameStorageKey: string;
        constructor(map: GalaxyMap, players: Player[], humanPlayer: Player);
        endTurn(): void;
        processPlayerStartTurn(player: Player): void;
        setNextPlayer(): void;
        serialize(): any;
        save(name: string): void;
    }
}
declare module Rance {
    class GalaxyMap {
        stars: Star[];
        fillerPoints: FillerPoint[];
        width: number;
        height: number;
        voronoi: MapVoronoiInfo;
        constructor(mapGen: MapGen2.MapGenResult);
        getIncomeBounds(): {
            min: number;
            max: number;
        };
        serialize(): any;
    }
}
declare module Rance {
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
        getScoredExpansionTargets(): {
            star: Star;
            score: number;
        }[];
        getScoredCleanPiratesTargets(): {
            star: Star;
            score: number;
        }[];
        getHostileShipsAtStar(star: Star): {
            [playerId: number]: Unit[];
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
        estimateGlobalStrength(player: Player): number;
        getPerceivedThreatOfPlayer(player: Player): number;
        getPerceivedThreatOfAllKnownPlayers(): {
            [playerId: number]: number;
        };
        getRelativePerceivedThreatOfAllKnownPlayers(): {
            [playerId: number]: number;
        };
        getDiplomacyEvaluations(currentTurn: number): {
            [playerId: number]: IDiplomacyEvaluation;
        };
    }
}
declare module Rance {
    class Objective {
        id: number;
        type: string;
        private _basePriority;
        priority: number;
        isOngoing: boolean;
        target: Star;
        constructor(type: string, priority: number, target: Star);
    }
}
declare module Rance {
    class ObjectivesAI {
        mapEvaluator: MapEvaluator;
        map: GalaxyMap;
        player: Player;
        personality: IPersonalityData;
        objectivesByType: {
            expansion: Objective[];
            cleanPirates: Objective[];
            heal: Objective[];
        };
        objectives: Objective[];
        maxActiveExpansionRequests: number;
        requests: any[];
        constructor(mapEvaluator: MapEvaluator, personality: IPersonalityData);
        setAllObjectives(): void;
        addObjectives(objectives: Objective[]): void;
        getIndependentFightingObjectives(objectiveType: string, evaluationScores: any, basePriority: number): Objective[];
        getExpansionObjectives(): Objective[];
        getCleanPiratesObjectives(): Objective[];
        getHealObjectives(): Objective[];
    }
}
declare module Rance {
    class Front {
        id: number;
        objective: Objective;
        priority: number;
        units: Unit[];
        minUnitsDesired: number;
        idealUnitsDesired: number;
        targetLocation: Star;
        musterLocation: Star;
        hasMustered: boolean;
        constructor(props: {
            id: number;
            objective: Objective;
            priority: number;
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
        getUnitCountByArchetype(): {
            [archetype: string]: number;
        };
        getUnitsByLocation(): {
            [starId: number]: Unit[];
        };
        moveFleets(afterMoveCallback: Function): void;
        healMoveRoutine(afterMoveCallback: Function): void;
        defaultMoveRoutine(afterMoveCallback: Function): void;
        executeAction(afterExecutedCallback: Function): void;
    }
}
declare module Rance {
    interface IArchetypeValues {
        [archetype: string]: number;
    }
    class FrontsAI {
        player: Player;
        map: GalaxyMap;
        mapEvaluator: MapEvaluator;
        objectivesAI: ObjectivesAI;
        personality: IPersonalityData;
        fronts: Front[];
        frontsRequestingUnits: Front[];
        frontsToMove: Front[];
        constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI, personality: IPersonalityData);
        getTotalUnitCountByArchetype(): IArchetypeValues;
        getUnitCompositionDeviationFromIdeal(idealWeights: IArchetypeValues, unitsByArchetype: IArchetypeValues): {
            [archetype: string]: number;
        };
        getGlobalUnitArcheypeScores(): {
            [archetype: string]: number;
        };
        getFrontUnitArchetypeScores(front: Front): {
            [archetype: string]: number;
        };
        scoreUnitFitForFront(unit: Unit, front: Front, frontArchetypeScores: IArchetypeValues): number;
        getHealUnitFitScore(unit: Unit, front: Front): number;
        getDefaultUnitFitScore(unit: Unit, front: Front, frontArchetypeScores: IArchetypeValues): number;
        private getUnitScoresForFront(units, front);
        assignUnits(): void;
        getFrontWithId(id: number): Front;
        createFront(objective: Objective): Front;
        removeInactiveFronts(): void;
        formFronts(): void;
        organizeFleets(): void;
        setFrontsToMove(): void;
        moveFleets(afterMovingAllCallback: Function): void;
        getUnitsToFillObjective(objective: Objective): {
            min: number;
            ideal: number;
        };
        getUnitsToFillExpansionObjective(objective: Objective): number;
        setUnitRequests(): void;
    }
}
declare module Rance {
    class EconomyAI {
        objectivesAI: ObjectivesAI;
        frontsAI: FrontsAI;
        mapEvaluator: MapEvaluator;
        player: Player;
        personality: IPersonalityData;
        constructor(props: {
            objectivesAI: ObjectivesAI;
            frontsAI: FrontsAI;
            mapEvaluator: MapEvaluator;
            personality: IPersonalityData;
        });
        satisfyAllRequests(): void;
        satisfyFrontRequest(front: Front): void;
    }
}
declare module Rance {
    class DiplomacyAI {
        game: Game;
        player: Player;
        diplomacyStatus: DiplomacyStatus;
        personality: IPersonalityData;
        mapEvaluator: MapEvaluator;
        constructor(mapEvaluator: MapEvaluator, game: Game, personality: IPersonalityData);
        setAttitudes(): void;
    }
}
declare module Rance {
    class AIController {
        player: Player;
        game: Game;
        personality: IPersonalityData;
        map: GalaxyMap;
        mapEvaluator: MapEvaluator;
        objectivesAI: ObjectivesAI;
        economicAI: EconomyAI;
        frontsAI: FrontsAI;
        diplomacyAI: DiplomacyAI;
        constructor(player: Player, game: Game, personality?: IPersonalityData);
        processTurn(afterFinishedCallback?: any): void;
        finishMovingFleets(afterFinishedCallback?: any): void;
    }
}
declare module Rance {
    class Player {
        id: number;
        name: string;
        color: number;
        colorAlpha: number;
        secondaryColor: number;
        flag: Flag;
        icon: string;
        units: {
            [id: number]: Unit;
        };
        resources: {
            [resourceType: string]: number;
        };
        fleets: Fleet[];
        items: Item[];
        isAI: boolean;
        personality: IPersonalityData;
        AIController: AIController;
        isIndependent: boolean;
        diplomacyStatus: DiplomacyStatus;
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
        constructor(isAI: boolean, id?: number);
        makeColorScheme(): void;
        setupAI(game: Game): void;
        setupPirates(): void;
        makeRandomFlag(seed?: any): void;
        setIcon(): void;
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
        addResource(resource: Templates.IResourceTemplate, amount: number): void;
        getResourceIncome(): {
            [resourceType: string]: {
                resource: Templates.IResourceTemplate;
                amount: number;
            };
        };
        getGloballyBuildableShips(): Templates.IUnitTemplate[];
        getNeighboringStars(): Star[];
        updateVisibleStars(): void;
        getVisibleStars(): Star[];
        getRevealedStars(): Star[];
        getRevealedButNotVisibleStars(): Star[];
        getDetectedStars(): Star[];
        starIsVisible(star: Star): boolean;
        starIsRevealed(star: Star): boolean;
        starIsDetected(star: Star): boolean;
        buildUnit(template: Templates.IUnitTemplate, location: Star): Unit;
        addItem(item: Item): void;
        removeItem(item: Item): void;
        getAllBuildableItems(): {
            star: Star;
            template: Templates.IItemTemplate;
        }[];
        getNearestOwnedStarTo(star: Star): Star;
        attackTarget(location: Star, target: any, battleFinishCallback?: any): void;
        serialize(): any;
    }
}
declare module Rance {
    interface IBattleData {
        location: Star;
        building: Building;
        attacker: {
            player: Player;
            ships: Unit[];
        };
        defender: {
            player: Player;
            ships: Unit[];
        };
    }
}
declare module Rance {
    class Battle {
        unitsById: {
            [id: number]: Unit;
        };
        unitsBySide: {
            [side: string]: Unit[];
        };
        side1: Unit[][];
        side1Player: Player;
        side2: Unit[][];
        side2Player: Player;
        battleData: IBattleData;
        turnOrder: Unit[];
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
        initUnit(unit: Unit, side: string, position: number[]): void;
        triggerBattleStartAbilities(): void;
        removeUnitFromTurnOrder(unit: Unit): boolean;
        addUnitToTurnOrder(unit: Unit): boolean;
        updateTurnOrder(): void;
        setActiveUnit(): void;
        endTurn(): void;
        getPlayerForSide(side: string): Player;
        getSideForPlayer(player: Player): string;
        getActivePlayer(): Player;
        getColumnByPosition(position: number): any;
        getCapturedUnits(victor: Player, maxCapturedUnits?: number): Unit[];
        getDeadUnits(capturedUnits: Unit[], victor: Player): Unit[];
        endBattle(): void;
        finishBattle(forcedVictor?: Player): void;
        getVictor(): Player;
        getTotalHealthForColumn(position: number): number;
        getTotalHealthForSide(side: string): {
            current: number;
            max: number;
        };
        getEvaluation(): number;
        swapColumnsForSide(side: string): void;
        swapColumnsIfNeeded(): void;
        checkBattleEnd(): boolean;
        makeVirtualClone(): Battle;
    }
}
declare module Rance {
    interface IAbilityUseDataEffect {
        effects: {
            (): void;
        }[];
        user: Unit;
        target: Unit;
        sfx: Templates.IBattleEffectSFX;
    }
    interface IAbilityUseData {
        user: Unit;
        originalTarget: Unit;
        actualTarget: Unit;
        beforeUse: {
            (): void;
        }[];
        effectsToCall: IAbilityUseDataEffect[];
        afterUse: {
            (): void;
        }[];
    }
    function getAbilityUseData(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate, target: Unit): IAbilityUseData;
    function useAbility(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate, target: Unit): void;
    function validateTarget(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate, target: Unit): boolean;
    function getTargetOrGuard(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate, target: Unit): Unit;
    function getGuarders(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate, target: Unit): Unit[];
    function getPotentialTargets(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate): Unit[];
    function getFleetsToTarget(battle: Battle, user: Unit, effect: Templates.IEffectTemplate): Unit[][];
    function getPotentialTargetsByPosition(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate): number[][];
    function getUnitsInAbilityArea(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate, target: number[]): Unit[];
    function getUnitsInEffectArea(battle: Battle, user: Unit, effect: Templates.IEffectTemplate, target: number[]): Unit[];
    function getTargetsForAllAbilities(battle: Battle, user: Unit): {
        [id: number]: Templates.IAbilityTemplate[];
    };
}
declare module Rance {
    module Templates {
        interface IStatusEffectAttributeAdjustment {
            flat?: number;
            multiplier?: number;
        }
        interface IStatusEffectAttributes {
            attack?: IStatusEffectAttributeAdjustment;
            defence?: IStatusEffectAttributeAdjustment;
            intelligence?: IStatusEffectAttributeAdjustment;
            speed?: IStatusEffectAttributeAdjustment;
        }
        interface IStatusEffectTemplate {
            type: string;
            displayName: string;
            attributes?: IStatusEffectAttributes;
            passiveSkills?: IPassiveSkillTemplate[];
        }
        module StatusEffects {
            var test: IStatusEffectTemplate;
        }
    }
}
declare module Rance {
    class StatusEffect {
        template: Templates.IStatusEffectTemplate;
        duration: number;
        constructor(template: Templates.IStatusEffectTemplate, duration: number);
        processTurnEnd(): void;
        clone(): StatusEffect;
    }
}
declare module Rance {
    class Unit {
        template: Templates.IUnitTemplate;
        id: number;
        name: string;
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
        battleStats: {
            moveDelay: number;
            side: string;
            position: number[];
            currentActionPoints: number;
            guardAmount: number;
            guardCoverage: string;
            captureChance: number;
            statusEffects: StatusEffect[];
            lastHealthBeforeReceivingDamage: number;
        };
        displayFlags: {
            isAnnihilated: boolean;
        };
        fleet: Fleet;
        items: {
            low: Item;
            mid: Item;
            high: Item;
        };
        passiveSkillsByPhase: {
            atBattleStart?: Templates.IPassiveSkillTemplate[];
            beforeAbilityUse?: Templates.IPassiveSkillTemplate[];
            afterAbilityUse?: Templates.IPassiveSkillTemplate[];
            atTurnStart?: Templates.IPassiveSkillTemplate[];
            inBattlePrep?: Templates.IPassiveSkillTemplate[];
        };
        passiveSkillsByPhaseAreDirty: boolean;
        sfxDuration: number;
        uiDisplayIsDirty: boolean;
        lastHealthDrawnAt: number;
        front: Front;
        constructor(template: Templates.IUnitTemplate, id?: number, data?: any);
        makeFromData(data: any): void;
        setInitialValues(): void;
        setBaseHealth(): void;
        setAttributes(experience?: number, variance?: number): void;
        getBaseMoveDelay(): number;
        resetMovePoints(): void;
        resetBattleStats(): void;
        setBattlePosition(battle: Battle, side: string, position: number[]): void;
        addStrength(amount: number): void;
        removeStrength(amount: number): void;
        removeActionPoints(amount: number): void;
        addMoveDelay(amount: number): void;
        updateStatusEffects(): void;
        isTargetable(): boolean;
        isActiveInBattle(): boolean;
        addItem(item: Item): boolean;
        removeItem(item: Item): boolean;
        destroyAllItems(): void;
        getAttributesWithItems(): any;
        addStatusEffect(statusEffect: StatusEffect): void;
        removeStatusEffect(statusEffect: StatusEffect): void;
        getTotalStatusEffectAttributeAdjustments(): Templates.IStatusEffectAttributes;
        getAttributesWithEffects(): any;
        updateCachedAttributes(): void;
        removeItemAtSlot(slot: string): boolean;
        getItemAbilities(): Templates.IAbilityTemplate[];
        getAllAbilities(): Templates.IAbilityTemplate[];
        getItemPassiveSkills(): Templates.IPassiveSkillTemplate[];
        getStatusEffectPassiveSkills(): Templates.IPassiveSkillTemplate[];
        getAllPassiveSkills(): Templates.IPassiveSkillTemplate[];
        updatePassiveSkillsByPhase(): void;
        getPassiveSkillsByPhase(): {
            atBattleStart?: Templates.IPassiveSkillTemplate[];
            beforeAbilityUse?: Templates.IPassiveSkillTemplate[];
            afterAbilityUse?: Templates.IPassiveSkillTemplate[];
            atTurnStart?: Templates.IPassiveSkillTemplate[];
            inBattlePrep?: Templates.IPassiveSkillTemplate[];
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
        addGuard(amount: number, coverage: string): void;
        removeAllGuard(): void;
        getCounterAttackStrength(): number;
        canActThisTurn(): boolean;
        isStealthy(): boolean;
        getVisionRange(): number;
        getDetectionRange(): number;
        heal(): void;
        getStrengthEvaluation(): number;
        drawBattleScene(props: {
            unitsToDraw?: number;
            maxUnitsPerColumn: number;
            degree: number;
            rotationAngle: number;
            scalingFactor: number;
            xDistance: number;
            zDistance: number;
            facesRight: boolean;
            maxWidth?: number;
            maxHeight?: number;
            desiredHeight?: number;
        }): HTMLCanvasElement;
        serialize(includeItems?: boolean): any;
        makeVirtualClone(): Unit;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableShip: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableShipsList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildingUpgradeList: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var PossibleActions: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var GalaxyMapUI: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var GalaxyMap: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FocusTimer: {
            componentDidMount: () => void;
            registerFocusTimerListener: () => void;
            clearFocusTimerListener: () => void;
            setFocusTimer: () => void;
        };
    }
}
declare module Rance {
    module UIComponents {
        var ColorPicker: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var ColorSetter: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var FlagPicker: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FlagSetter: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var PlayerSetup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var SetupGamePlayers: React.Factory<any>;
    }
}
declare module Rance {
    module MapGen2 {
        class Region2 {
            id: string;
            isFiller: boolean;
            stars: Star[];
            fillerPoints: FillerPoint[];
            constructor(id: string, isFiller: boolean);
            addStar(star: Star): void;
            addFillerPoint(point: FillerPoint): void;
            severLinksByQualifier(qualifierFN: (a: Star, b: Star) => boolean): void;
            severLinksToRegionsExcept(exemptRegions: Region2[]): void;
        }
    }
}
declare module Rance {
    module MapGen2 {
        class Sector2 {
            id: number;
            stars: Star[];
            resourceDistributionFlags: string[];
            resourceType: Templates.IResourceTemplate;
            resourceLocation: Star;
            constructor(id: number);
            addStar(star: Star): void;
            addResource(resource: Templates.IResourceTemplate): void;
            getNeighboringStars(): Star[];
            getMajorityRegions(): Region2[];
        }
    }
}
declare module Rance {
    module MapGen2 {
        function linkAllStars(stars: Star[]): void;
        function partiallyCutLinks(stars: Star[], minConnections: number, maxCutsPerRegion: number): void;
        function makeSectors(stars: Star[], minSize: number, maxSize: number): {
            [sectorId: number]: Sector2;
        };
        function addDefenceBuildings(star: Star, amount?: number, addSectorCommand?: boolean): void;
        function setDistancesFromNearestPlayerOwnedStar(stars: Star[]): void;
        function setupPirates(stars: Star[], player: Player, variance?: number, intensity?: number): void;
    }
}
declare module Rance {
    module Templates {
        module MapGen {
            interface IMapGenOptions {
                defaultOptions: IDefaultOptions;
                basicOptions?: IMapSpecificOptions;
                advancedOptions?: IMapSpecificOptions;
            }
            interface IDefaultOptions {
                height: IRange;
                width: IRange;
                starCount: IRange;
            }
            interface IMapSpecificOptions {
                [optionName: string]: IRange;
            }
            interface IMapGenOptionValues {
                defaultOptions: {
                    height: number;
                    width: number;
                    starCount: number;
                };
                basicOptions?: {
                    [optionName: string]: number;
                };
                advancedOptions?: {
                    [optionName: string]: number;
                };
            }
        }
    }
}
declare module Rance {
    module Templates {
        module MapGen {
            function spiralGalaxyGeneration(options: IMapGenOptionValues, players: Player[], independents: Player[]): MapGen2.MapGenResult;
        }
    }
}
declare module Rance {
    module Templates {
        interface IMapGenTemplate {
            key: string;
            displayName: string;
            description?: string;
            minPlayers: number;
            maxPlayers: number;
            options: MapGen.IMapGenOptions;
            mapGenFunction: (options: MapGen.IMapGenOptionValues, players: Player[], independents: Player[]) => MapGen2.MapGenResult;
        }
    }
}
declare module Rance {
    module Templates {
        module MapGen {
            var spiralGalaxy: IMapGenTemplate;
        }
    }
}
declare module Rance {
    module Templates {
        module MapGen {
            var tinierSpiralGalaxy: IMapGenTemplate;
        }
    }
}
declare module Rance {
    module UIComponents {
        var MapGenOption: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var MapGenOptions: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var MapSetup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var SetupGame: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var FlagMaker: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        interface ReactComponentPlaceHolder {
        }
        interface ReactDOMPlaceHolder {
        }
        var Stage: React.Factory<{}>;
    }
}
declare module Rance {
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
declare module Rance {
    class PlayerControl {
        player: Player;
        selectedFleets: Fleet[];
        inspectedFleets: Fleet[];
        currentlyReorganizing: Fleet[];
        currentAttackTargets: any[];
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
        getCurrentAttackTargets(): {
            type: string;
            enemy: Player;
            building: Building;
            ships: Unit[];
        }[];
        attackTarget(target: any): boolean;
    }
}
declare module Rance {
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
declare module Rance {
    interface IMapRendererLayer {
        drawingFunction: (map: GalaxyMap) => PIXI.Container;
        container: PIXI.Container;
        interactive: boolean;
        isDirty: boolean;
    }
    interface IMapRendererLayerMapMode {
        name: string;
        displayName: string;
        layers: {
            layer: IMapRendererLayer;
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
            [name: string]: IMapRendererLayer;
        };
        mapModes: {
            [name: string]: IMapRendererLayerMapMode;
        };
        fowTilingSprite: PIXI.extras.TilingSprite;
        fowSpriteCache: {
            [starId: number]: PIXI.Sprite;
        };
        fleetTextTextureCache: {
            [fleetSize: number]: PIXI.Texture;
        };
        currentMapMode: IMapRendererLayerMapMode;
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
        hasLayerInMapMode(layer: IMapRendererLayer): boolean;
        setLayerAsDirty(layerName: string): void;
        setAllLayersAsDirty(): void;
        drawLayer(layer: IMapRendererLayer): void;
        setMapMode(newMapMode: string): void;
        render(): void;
    }
}
declare var tempCameraId: number;
declare module Rance {
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
declare module Rance {
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
declare module Rance {
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
declare module Rance {
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
declare module Rance {
    module ShaderSources {
        var nebula: string[];
        var occupation: string[];
    }
}
declare module Rance {
    class NebulaFilter extends PIXI.AbstractFilter {
        constructor(uniforms: any);
    }
    class OccupationFilter extends PIXI.AbstractFilter {
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
declare module Rance {
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
declare module Rance {
    class Renderer {
        stage: PIXI.Container;
        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        pixiContainer: HTMLCanvasElement;
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
        constructor();
        init(): void;
        destroy(): void;
        removeRendererView(): void;
        bindRendererView(container: HTMLCanvasElement): void;
        initLayers(): void;
        setupDefaultLayers(): void;
        setupBackgroundLayers(): void;
        addCamera(): void;
        addEventListeners(): void;
        resize(): void;
        makeBackgroundTexture(seed?: any): PIXI.Texture;
        renderNebula(): PIXI.Texture;
        renderBackground(): void;
        renderBlurredNebula(x: number, y: number, width: number, height: number, seed?: any): PIXI.Texture;
        renderOnce(): void;
        pause(): void;
        resume(): void;
        render(renderLoopId?: number): void;
    }
}
declare module Rance {
    function toggleDebugMode(): void;
    function inspectSave(saveName: string): any;
}
declare module Rance {
    class AppLoader {
        loaded: {
            DOM: boolean;
            emblems: boolean;
            units: boolean;
            buildings: boolean;
            other: boolean;
        };
        startTime: number;
        onLoaded: any;
        imageCache: {
            [type: string]: {
                [id: string]: HTMLImageElement;
            };
        };
        constructor(onLoaded: any);
        private spriteSheetToDataURLs(sheetData, sheetImg);
        private spriteSheetToTextures(sheetData, sheetImg);
        loadDOM(): void;
        loadImagesFN(identifier: string): void;
        loadEmblems(): void;
        loadUnits(): void;
        loadBuildings(): void;
        loadOther(): void;
        checkLoaded(): void;
    }
}
declare module Rance {
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
        deserializeGame(data: any): Game;
        deserializeMap(data: any): GalaxyMap;
        deserializeStar(data: any): Star;
        deserializeBuildings(data: any): void;
        deserializeBuilding(data: any): Building;
        deserializePlayer(data: any): Player;
        deserializeDiplomacyStatus(player: Player, data: any): void;
        deserializeFlag(data: any): Flag;
        deserializeFleet(player: Player, data: any): Fleet;
        deserializeShip(data: any): Unit;
        deserializeItem(data: any, player: Player): void;
    }
}
declare module Rance {
    function setAllDynamicTemplateProperties(): void;
}
declare module Rance {
    module Tutorials {
        var uiTutorial: {
            pages: (string | React.Descriptor<React.DomAttributes>)[];
        };
    }
}
declare module Rance {
    function saveOptions(slot?: number): void;
    function loadOptions(slot?: number): void;
    module defaultOptions {
        var battleAnimationTiming: {
            before: number;
            effectDuration: number;
            after: number;
        };
        var debugMode: boolean;
        var debugOptions: {
            battleSimulationDepth: number;
        };
        var ui: {
            noHamburger: boolean;
        };
    }
    var Options: any;
}
declare module Rance {
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
        loader: AppLoader;
        renderer: Renderer;
        game: Game;
        mapRenderer: MapRenderer;
        reactUI: ReactUI;
        humanPlayer: Player;
        playerControl: PlayerControl;
        images: {
            [type: string]: {
                [id: string]: HTMLImageElement;
            };
        };
        itemGenerator: ItemGenerator;
        constructor();
        makeApp(): void;
        destroy(): void;
        load(saveKey: string): void;
        makeGameFromSetup(map: GalaxyMap, players: Player[], independents: Player[]): void;
        makeGame(): Game;
        makePlayers(): {
            players: Player[];
            independents: Player[];
        };
        makeMap(playerData: {
            players: Player[];
            independents: Player[];
        }): GalaxyMap;
        initGame(): void;
        initDisplay(): void;
        initUI(): void;
        hookUI(): void;
        setInitialScene(): void;
    }
}
declare var app: Rance.App;
