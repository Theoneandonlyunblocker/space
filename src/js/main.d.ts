/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/clipper.d.ts" />
/// <reference path="../../lib/husl.d.ts" />
/// <reference path="../../lib/rng.d.ts" />
/// <reference path="../../lib/voronoi.d.ts" />
declare module Rance {
    function EventManager(): void;
    var eventManager: any;
}
declare module Rance {
    module UIComponents {
        var UnitStrength: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitActions: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitStatus: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitIcon: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
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
                clone: any;
            };
            handleMouseDown: (e: any) => void;
            handleMouseMove: (e: any) => void;
            handleDrag: (e: any) => void;
            handleMouseUp: (e: any) => void;
            handleDragEnd: (e: any) => void;
            addEventListeners: () => void;
            removeEventListeners: () => void;
            componentDidMount: () => void;
            componentWillUnmount: () => void;
        };
    }
}
declare module Rance {
    module UIComponents {
        var Unit: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var EmptyUnit: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitWrapper: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetColumn: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var Fleet: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var TurnCounter: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var TurnOrder: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var AbilityTooltip: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleScore: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var Battle: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
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
        /**
        * props:
        *   listItems
        *   initialColumns
        *
        * state:
        *   selected
        *   columns
        *   sortBy
        *
        * children:
        *   listelement:
        *     key
        *     tr
        *     getData()
        *
        *  columns:
        *    props (classes etc)
        *    label
        *    sorting (alphabet, numeric, null)
        *    title?
        */
        var List: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitListItem: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemListItem: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitItem: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitItemWrapper: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var MenuUnitInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var ItemEquip: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var BattlePrep: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var Popup: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var PopupManager: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var TopBar: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetControls: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var ShipInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var DraggableShipInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetContents: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetSelection: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FleetReorganization: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var DefenceBuilding: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var DefenceBuildingList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var StarInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var AttackTarget: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableBuilding: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableBuildingList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    function randInt(min: any, max: any): number;
    function randRange(min: any, max: any): any;
    function getRandomArrayItem(target: any[]): any;
    function getRandomKey(target: any): string;
    function getRandomProperty(target: any): any;
    function getFrom2dArray(target: any[][], arr: number[][]): any[];
    function flatten2dArray(toFlatten: any[][]): any[];
    function reverseSide(side: string): string;
    function turnOrderSortFunction(a: Unit, b: Unit): number;
    function makeRandomShip(): Unit;
    function centerDisplayObjectContainer(toCenter: PIXI.DisplayObjectContainer): void;
    function rectContains(rect: any, point: any): boolean;
    function hexToString(hex: number): string;
    function stringToHex(text: string): number;
    function makeTempPlayerIcon(player: Player, size: number): string;
    function colorImageInPlayerColor(imageSrc: string, player: Player): string;
    function cloneObject(toClone: any): any;
    function recursiveRemoveAttribute(parent: any, attribute: string): void;
    function clamp(value: number, min: number, max: number): number;
    function getAngleBetweenDegrees(degA: number, degB: number): number;
    function shiftPolygon(polygon: Point[], amount: number): {
        x: number;
        y: number;
    }[];
    function convertCase(polygon: any[]): any;
    function offsetPolygon(polygon: Point[], amount: number): any;
    function arraysEqual(a1: any[], a2: any[]): boolean;
    function bitmapMask(base: PIXI.DisplayObjectContainer, mask: PIXI.DisplayObjectContainer): void;
}
declare module Rance {
    interface TargetingFunction {
        (fleets: Rance.Unit[][], target: number[]): Rance.Unit[];
    }
    var targetSingle: TargetingFunction;
    var targetAll: TargetingFunction;
    var targetRow: TargetingFunction;
    var targetColumn: TargetingFunction;
    var targetColumnNeighbors: TargetingFunction;
    var targetNeighbors: TargetingFunction;
}
declare module Rance {
    module Templates {
        interface IEffectTemplate {
            name: string;
            targetFleets: string;
            targetingFunction: Rance.TargetingFunction;
            targetRange: string;
            effect: (user: Rance.Unit, target: Rance.Unit) => void;
        }
        module Effects {
            var dummyTargetColumn: IEffectTemplate;
            var dummyTargetAll: IEffectTemplate;
            var rangedAttack: IEffectTemplate;
            var closeAttack: IEffectTemplate;
            var wholeRowAttack: IEffectTemplate;
            var bombAttack: IEffectTemplate;
            var guardColumn: IEffectTemplate;
            var standBy: IEffectTemplate;
        }
    }
}
declare module Rance {
    module Templates {
        interface AbilityTemplate {
            name: string;
            moveDelay: number;
            preparation?: {
                turnsToPrep: number;
                prepDelay: number;
                interruptsNeeded: number;
            };
            actionsUse: any;
            mainEffect: Templates.IEffectTemplate;
            secondaryEffects?: Templates.IEffectTemplate[];
        }
        module Abilities {
            var dummyTargetColumn: AbilityTemplate;
            var dummyTargetAll: AbilityTemplate;
            var rangedAttack: AbilityTemplate;
            var closeAttack: AbilityTemplate;
            var wholeRowAttack: AbilityTemplate;
            var bombAttack: AbilityTemplate;
            var guardColumn: AbilityTemplate;
            var standBy: AbilityTemplate;
        }
    }
}
declare module Rance {
    module Templates {
        interface TypeTemplate {
            type: string;
            typeName: string;
            isSquadron: boolean;
            buildCost: number;
            icon: string;
            maxStrength: number;
            maxMovePoints: number;
            visionRange: number;
            attributeLevels: {
                attack: number;
                defence: number;
                intelligence: number;
                speed: number;
            };
            abilities: Templates.AbilityTemplate[];
        }
        module ShipTypes {
            var cheatShip: TypeTemplate;
            var fighterSquadron: TypeTemplate;
            var bomberSquadron: TypeTemplate;
            var battleCruiser: TypeTemplate;
            var scout: TypeTemplate;
            var shieldBoat: TypeTemplate;
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
            icon: string;
            buildCost: number;
            maxPerType: number;
            maxUpgradeLevel: number;
            upgradeInto?: {
                type: string;
                level: number;
            }[];
            onBuild?: () => void;
            onTurnEnd?: () => void;
        }
        module Buildings {
            var sectorCommand: IBuildingTemplate;
            var starBase: IBuildingTemplate;
            var commercialPort: IBuildingTemplate;
            var deepSpaceRadar: IBuildingTemplate;
        }
    }
}
declare module Rance {
    class Building {
        public template: Rance.Templates.IBuildingTemplate;
        public location: Rance.Star;
        public controller: Rance.Player;
        public upgradeLevel: number;
        constructor(props: {
            template: Rance.Templates.IBuildingTemplate;
            location: Rance.Star;
            controller?: Rance.Player;
            upgradeLevel?: number;
        });
        public getPossibleUpgrades(): {
            type: string;
            level: number;
        }[];
        public setController(newController: Rance.Player): void;
        public serialize(): any;
    }
}
declare module Rance {
    class Star implements Rance.Point {
        public id: number;
        public x: number;
        public y: number;
        public linksTo: Star[];
        public linksFrom: Star[];
        public distance: number;
        public region: string;
        public backgroundSeed: string;
        public baseIncome: number;
        public name: string;
        public owner: Rance.Player;
        public fleets: {
            [playerId: string]: Rance.Fleet[];
        };
        public buildings: {
            [category: string]: Rance.Building[];
        };
        public distanceFromNearestStartLocation: number;
        public voronoiId: number;
        public voronoiCell: any;
        public indexedNeighborsInRange: {
            [range: number]: {
                all: Star[];
                byRange: {
                    [range: number]: Star[];
                };
            };
        };
        public indexedDistanceToStar: {
            [id: number]: number;
        };
        constructor(x: number, y: number, id?: number);
        public addBuilding(building: Rance.Building): void;
        public removeBuilding(building: Rance.Building): void;
        public getSecondaryController(): Rance.Player;
        public updateController(): any;
        public getIncome(): number;
        public getBuildingsByType(buildingTemplate: Rance.Templates.IBuildingTemplate): any[];
        public getBuildableBuildings(): any[];
        public getAllFleets(): any[];
        public getFleetIndex(fleet: Rance.Fleet): number;
        public hasFleet(fleet: Rance.Fleet): boolean;
        public addFleet(fleet: Rance.Fleet): boolean;
        public addFleets(fleets: Rance.Fleet[]): void;
        public removeFleet(fleet: Rance.Fleet): boolean;
        public removeFleets(fleets: Rance.Fleet[]): void;
        public getAllShipsOfPlayer(player: Rance.Player): Rance.Unit[];
        public getTargetsForPlayer(player: Rance.Player): any[];
        public getFirstEnemyDefenceBuilding(player: Rance.Player): Rance.Building;
        public getEnemyFleetOwners(player: Rance.Player, excludedTarget?: Rance.Player): Rance.Player[];
        public setPosition(x: number, y: number): void;
        public hasLink(linkTo: Star): boolean;
        public addLink(linkTo: Star): void;
        public removeLink(linkTo: Star): void;
        public getAllLinks(): Star[];
        public clearLinks(): void;
        public getLinksByRegion(): {
            [regionId: string]: Star[];
        };
        public severLinksToRegion(regionToSever: string): void;
        public severLinksToFiller(): void;
        public severLinksToNonCenter(): void;
        public getNeighbors(): Star[];
        public getLinkedInRange(range: number): {
            all: any[];
            byRange: {
                [range: number]: Star[];
            };
        };
        public getDistanceToStar(target: Star): number;
        public getVisionRange(): number;
        public getVision(): Star[];
        public getHealingFactor(player: Rance.Player): number;
        public getBackgroundSeed(): string;
        public severLinksToNonAdjacent(): void;
        public serialize(): any;
    }
}
declare module Rance {
    class Fleet {
        public player: Rance.Player;
        public ships: Rance.Unit[];
        public location: Rance.Star;
        public visionIsDirty: boolean;
        public visibleStars: Rance.Star[];
        public id: number;
        public name: string;
        constructor(player: Rance.Player, ships: Rance.Unit[], location: Rance.Star, id?: number);
        public getShipIndex(ship: Rance.Unit): number;
        public hasShip(ship: Rance.Unit): boolean;
        public deleteFleet(): void;
        public mergeWith(fleet: Fleet): void;
        public addShip(ship: Rance.Unit): boolean;
        public addShips(ships: Rance.Unit[]): void;
        public removeShip(ship: Rance.Unit): boolean;
        public removeShips(ships: Rance.Unit[]): void;
        public transferShip(fleet: Fleet, ship: Rance.Unit): boolean;
        public split(): Fleet;
        public getMinCurrentMovePoints(): number;
        public getMinMaxMovePoints(): number;
        public canMove(): boolean;
        public subtractMovePoints(): void;
        public move(newLocation: Rance.Star): void;
        public getPathTo(newLocation: Rance.Star): {
            star: Rance.Star;
            cost: any;
        }[];
        public pathFind(newLocation: Rance.Star, onMove?: any): void;
        public getFriendlyFleetsAtOwnLocation(): Fleet[];
        public getTotalStrength(): {
            current: number;
            max: number;
        };
        public updateVisibleStars(): void;
        public getVision(): Rance.Star[];
        public serialize(): any;
    }
}
declare module Rance {
    module Templates {
        interface ISubEmblemTemplate {
            type: string;
            foregroundOnly: boolean;
            imageSrc: string;
        }
        module SubEmblems {
            var emblem0: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem33: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem34: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem35: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem36: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem37: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem38: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem39: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem40: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem41: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem42: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem43: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem44: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem45: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem46: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem47: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem48: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem49: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem50: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem51: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem52: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem53: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem54: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem55: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem56: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem57: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem58: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem59: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
            var emblem61: {
                type: string;
                foregroundOnly: boolean;
                imageSrc: string;
            };
        }
    }
}
declare module Rance {
    module Templates {
        interface IColorRangeTemplate {
        }
        module ColorRanges {
        }
    }
}
declare module Rance {
    function hex2rgb(hex: number): number[];
    function rgb2hex(rgb: number[]): number;
    function hsvToRgb(h: number, s: number, v: number): number[];
    function hslToRgb(h: number, s: number, l: number): number[];
    function rgbToHsv(r: any, g: any, b: any): any[];
    function rgbToHsl(r: number, g: number, b: number): number[];
    function hslToHex(h: number, s: number, l: number): number;
    function hsvToHex(h: number, s: number, v: number): number;
    function hexToHsl(hex: number): number[];
    function hexToHsv(hex: number): number[];
    interface IRange {
        min?: number;
        max?: number;
    }
    function excludeFromRanges(ranges: IRange[], toExclude: IRange): IRange[];
    function getIntersectingRanges(ranges: IRange[], toIntersectWith: IRange): IRange[];
    function excludeFromRange(range: IRange, toExclude: IRange): IRange[];
    function randomSelectFromRanges(ranges: IRange[]): any;
    function makeRandomVibrantColor(): any[];
    function makeRandomDeepColor(): any[];
    function makeRandomLightColor(): any[];
    function makeRandomColor(values: {
        h?: IRange[];
        s?: IRange[];
        l?: IRange[];
    }): any[];
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
        public alpha: number;
        public color: number;
        public inner: Rance.Templates.ISubEmblemTemplate;
        public outer: Rance.Templates.ISubEmblemTemplate;
        constructor(color: number);
        public isForegroundOnly(): boolean;
        public generateRandom(minAlpha: number, rng?: any): void;
        public generateSubEmblems(rng: any): void;
        public draw(): HTMLCanvasElement;
        public drawSubEmblem(toDraw: Rance.Templates.ISubEmblemTemplate): HTMLCanvasElement;
    }
}
declare module Rance {
    class Flag {
        public width: number;
        public height: number;
        public mainColor: number;
        public secondaryColor: number;
        public tetriaryColor: number;
        public backgroundEmblem: Rance.Emblem;
        public foregroundEmblem: Rance.Emblem;
        public seed: any;
        constructor(props: {
            width: number;
            mainColor?: number;
            secondaryColor?: number;
            tetriaryColor?: number;
            height?: number;
            backgroundEmblem?: Rance.Emblem;
            foregroundEmblem?: Rance.Emblem;
        });
        public generateRandom(seed?: any): void;
        public draw(): HTMLCanvasElement;
        public serialize(): {
            seed: any;
        };
    }
}
declare module Rance {
    module Templates {
        interface IItemTemplate {
            type: string;
            displayName: string;
            slot: string;
            abilities: Templates.AbilityTemplate[];
        }
        module Items {
            var testItem: {
                type: string;
                displayName: string;
                slot: string;
                abilities: Templates.AbilityTemplate[];
            };
            var testItemA: {
                type: string;
                displayName: string;
                slot: string;
                abilities: Templates.AbilityTemplate[];
            };
            var testItem2: {
                type: string;
                displayName: string;
                slot: string;
                abilities: Templates.AbilityTemplate[];
            };
            var testItem3: {
                type: string;
                displayName: string;
                slot: string;
                abilities: Templates.AbilityTemplate[];
            };
        }
    }
}
declare module Rance {
    class Item {
        public id: number;
        public template: Rance.Templates.IItemTemplate;
        public unit: Rance.Unit;
        constructor(template: Rance.Templates.IItemTemplate);
    }
}
declare module Rance {
    class Player {
        public id: number;
        public name: string;
        public color: number;
        public colorAlpha: number;
        public secondaryColor: number;
        public flag: Rance.Flag;
        public icon: string;
        public units: {
            [id: number]: Rance.Unit;
        };
        public fleets: Rance.Fleet[];
        public items: Rance.Item[];
        public money: number;
        public controlledLocations: Rance.Star[];
        public visionIsDirty: boolean;
        public visibleStars: {
            [id: number]: Rance.Star;
        };
        public revealedStars: {
            [id: number]: Rance.Star;
        };
        constructor(id?: number);
        public makeColorScheme(): void;
        public setupPirates(): void;
        public makeFlag(): void;
        public addUnit(unit: Rance.Unit): void;
        public removeUnit(unit: Rance.Unit): void;
        public getAllUnits(): any[];
        public forEachUnit(operator: (Unit: any) => void): void;
        public getFleetIndex(fleet: Rance.Fleet): number;
        public addFleet(fleet: Rance.Fleet): void;
        public removeFleet(fleet: Rance.Fleet): void;
        public getFleetsWithPositions(): any[];
        public hasStar(star: Rance.Star): boolean;
        public addStar(star: Rance.Star): boolean;
        public removeStar(star: Rance.Star): boolean;
        public getIncome(): number;
        public getBuildableShips(): any[];
        public getIsland(start: Rance.Star): Rance.Star[];
        public getAllIslands(): Rance.Star[][];
        public getBorderEdges(): any[];
        public getBorderPolygons(): any[];
        public updateVisibleStars(): void;
        public getVisibleStars(): Rance.Star[];
        public getRevealedStars(): Rance.Star[];
        public getRevealedButNotVisibleStars(): Rance.Star[];
        public addItem(item: Rance.Item): void;
        public serialize(): any;
    }
}
declare module Rance {
    interface IBattleData {
        location: Rance.Star;
        building: Rance.Building;
        attacker: {
            player: Rance.Player;
            ships: Rance.Unit[];
        };
        defender: {
            player: Rance.Player;
            ships: Rance.Unit[];
        };
    }
}
declare module Rance {
    class Battle {
        public unitsById: {
            [id: number]: Rance.Unit;
        };
        public unitsBySide: {
            [side: string]: Rance.Unit[];
        };
        public side1: Rance.Unit[][];
        public side1Player: Rance.Player;
        public side2: Rance.Unit[][];
        public side2Player: Rance.Player;
        public battleData: Rance.IBattleData;
        public turnOrder: Rance.Unit[];
        public activeUnit: Rance.Unit;
        public currentTurn: number;
        public maxTurns: number;
        public turnsLeft: number;
        public startHealth: {
            side1: number;
            side2: number;
        };
        public evaluation: {
            [turnNumber: number]: number;
        };
        public isVirtual: boolean;
        public ended: boolean;
        constructor(props: {
            battleData: Rance.IBattleData;
            side1: Rance.Unit[][];
            side2: Rance.Unit[][];
            side1Player: Rance.Player;
            side2Player: Rance.Player;
        });
        public init(): void;
        public forEachUnit(operator: (Unit: any) => any): void;
        public initUnit(unit: Rance.Unit, side: string, position: number[]): void;
        public removeUnitFromTurnOrder(unit: Rance.Unit): boolean;
        public addUnitToTurnOrder(unit: Rance.Unit): boolean;
        public updateTurnOrder(): void;
        public setActiveUnit(): void;
        public endTurn(): void;
        public getFleetsForSide(side: string): any;
        public getPlayerForSide(side: string): Rance.Player;
        public getActivePlayer(): Rance.Player;
        public getColumnByPosition(position: number): any;
        public endBattle(): void;
        public finishBattle(): void;
        public getVictor(): Rance.Player;
        public getTotalHealthForColumn(position: number): number;
        public getTotalHealthForSide(side: string): {
            current: number;
            max: number;
        };
        public getEvaluation(): number;
        public swapFleetColumnsForSide(side: string): void;
        public swapColumnsIfNeeded(): void;
        public checkBattleEnd(): boolean;
        public makeVirtualClone(): Battle;
    }
}
declare module Rance {
    function useAbility(battle: Battle, user: Unit, ability: Templates.AbilityTemplate, target: Unit): void;
    function validateTarget(battle: Battle, user: Unit, ability: Templates.AbilityTemplate, target: Unit): boolean;
    function getTargetOrGuard(battle: Battle, user: Unit, ability: Templates.AbilityTemplate, target: Unit): Unit;
    function getGuarders(battle: Battle, user: Unit, ability: Templates.AbilityTemplate, target: Unit): Unit[];
    function getPotentialTargets(battle: Battle, user: Unit, ability: Templates.AbilityTemplate): Unit[];
    function getFleetsToTarget(battle: Battle, user: Unit, effect: Templates.IEffectTemplate): Unit[][];
    function getPotentialTargetsByPosition(battle: Battle, user: Unit, ability: Templates.AbilityTemplate): number[][];
    function getUnitsInAbilityArea(battle: Battle, user: Unit, ability: Templates.AbilityTemplate, target: number[]): Unit[];
    function getUnitsInEffectArea(battle: Battle, user: Unit, effect: Templates.IEffectTemplate, target: number[]): Unit[];
    function getTargetsForAllAbilities(battle: Battle, user: Unit): {
        [id: number]: Templates.AbilityTemplate[];
    };
}
declare module Rance {
    class PriorityQueue {
        public items: {
            [priority: number]: any[];
        };
        constructor();
        public isEmpty(): boolean;
        public push(priority: number, data: any): void;
        public pop(): any;
        public peek(): any[];
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
    class Unit {
        public template: Rance.Templates.TypeTemplate;
        public id: number;
        public name: string;
        public maxStrength: number;
        public currentStrength: number;
        public isSquadron: boolean;
        public currentMovePoints: number;
        public maxMovePoints: number;
        public maxActionPoints: number;
        public attributes: {
            attack: number;
            defence: number;
            intelligence: number;
            speed: number;
        };
        public battleStats: {
            moveDelay: number;
            side: string;
            position: number[];
            currentActionPoints: number;
            guard: {
                value: number;
                coverage: string;
            };
        };
        public fleet: Rance.Fleet;
        public items: {
            low: Rance.Item;
            mid: Rance.Item;
            high: Rance.Item;
        };
        public uiDisplayIsDirty: boolean;
        constructor(template: Rance.Templates.TypeTemplate, id?: number);
        public setValues(): void;
        public setBaseHealth(): void;
        public setActionPoints(): void;
        public setAttributes(experience?: number, variance?: number): void;
        public getBaseMoveDelay(): number;
        public resetMovePoints(): void;
        public resetBattleStats(): void;
        public setBattlePosition(battle: Rance.Battle, side: string, position: number[]): void;
        public addStrength(amount: number): void;
        public removeStrength(amount: number): void;
        public removeActionPoints(amount: any): void;
        public addMoveDelay(amount: number): void;
        public isTargetable(): boolean;
        public addItem(item: Rance.Item): boolean;
        public removeItem(item: Rance.Item): boolean;
        public removeItemAtSlot(slot: string): boolean;
        public getItemAbilities(): any[];
        public getAllAbilities(): Rance.Templates.AbilityTemplate[];
        public recieveDamage(amount: number, damageType: string): void;
        public getAttackDamageIncrease(damageType: string): number;
        public getReducedDamageFactor(damageType: string): number;
        public addToFleet(fleet: Rance.Fleet): void;
        public removeFromFleet(): void;
        public die(): void;
        public removeGuard(amount: number): void;
        public addGuard(amount: number, coverage: string): void;
        public removeAllGuard(): void;
        public heal(): void;
        public serialize(): any;
        public makeVirtualClone(): Unit;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableShip: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildableShipsList: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var PossibleActions: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var GalaxyMapUI: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var GalaxyMap: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var FlagMaker: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var Stage: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    class ReactUI {
        public container: HTMLElement;
        public currentScene: string;
        public stage: any;
        public battle: Rance.Battle;
        public battlePrep: Rance.BattlePrep;
        public renderer: Rance.Renderer;
        public galaxyMap: Rance.GalaxyMap;
        public playerControl: Rance.PlayerControl;
        public player: Rance.Player;
        public game: Rance.Game;
        constructor(container: HTMLElement);
        public addEventListeners(): void;
        public switchScene(newScene: string): void;
        public render(): void;
    }
}
declare module Rance {
    class PlayerControl {
        public player: Rance.Player;
        public reactUI: Rance.ReactUI;
        public selectedFleets: Rance.Fleet[];
        public currentlyReorganizing: Rance.Fleet[];
        public currentAttackTargets: any[];
        public selectedStar: Rance.Star;
        public preventingGhost: boolean;
        constructor(player: Rance.Player);
        public addEventListeners(): void;
        public preventGhost(delay: number): void;
        public clearSelection(): void;
        public updateSelection(endReorganizingFleets?: boolean): void;
        public areAllFleetsInSameLocation(): boolean;
        public selectFleets(fleets: Rance.Fleet[]): void;
        public deselectFleet(fleet: Rance.Fleet): void;
        public getMasterFleetForMerge(): Rance.Fleet;
        public mergeFleets(): void;
        public selectStar(star: Rance.Star): void;
        public moveFleets(star: Rance.Star): void;
        public splitFleet(fleet: Rance.Fleet): void;
        public startReorganizingFleets(fleets: Rance.Fleet[]): void;
        public endReorganizingFleets(): void;
        public getCurrentAttackTargets(): any[];
        public attackTarget(target: any): boolean;
    }
}
declare module Rance {
    class BattlePrep {
        public player: Rance.Player;
        public enemy: Rance.Player;
        public battleData: Rance.IBattleData;
        public availableUnits: Rance.Unit[];
        public enemyUnits: Rance.Unit[];
        public fleet: Rance.Unit[][];
        public alreadyPlaced: {
            [id: number]: number[];
        };
        constructor(player: Rance.Player, battleData: Rance.IBattleData);
        public setAvailableUnits(): void;
        public makeEnemyFleet(): any[][];
        public getUnitPosition(unit: Rance.Unit): number[];
        public getUnitAtPosition(position: number[]): Rance.Unit;
        public setUnit(unit: Rance.Unit, position: number[]): void;
        public swapUnits(unit1: Rance.Unit, unit2: Rance.Unit): void;
        public removeUnit(unit: Rance.Unit): void;
        public makeBattle(): Rance.Battle;
    }
}
declare module Rance {
    module Templates {
        module MapGen {
            var defaultMap: {
                mapOptions: {
                    width: number;
                    height: number;
                };
                starGeneration: {
                    galaxyType: string;
                    totalAmount: number;
                    arms: number;
                    centerSize: number;
                    amountInCenter: number;
                };
                relaxation: {
                    timesToRelax: number;
                    dampeningFactor: number;
                };
            };
        }
    }
}
declare module Rance {
    class Triangle {
        public a: Rance.Point;
        public b: Rance.Point;
        public c: Rance.Point;
        public circumCenterX: number;
        public circumCenterY: number;
        public circumRadius: number;
        constructor(a: Rance.Point, b: Rance.Point, c: Rance.Point);
        public getPoints(): Rance.Point[];
        public getCircumCenter(): number[];
        public calculateCircumCircle(tolerance?: number): void;
        public circumCircleContainsPoint(point: Rance.Point): boolean;
        public getEdges(): Rance.Point[][];
        public getAmountOfSharedVerticesWith(toCheckAgainst: Triangle): number;
    }
}
declare module Rance {
    function triangulate(vertices: Point[]): {
        triangles: Triangle[];
        superTriangle: Triangle;
    };
    function voronoiFromTriangles(triangles: Triangle[]): any;
    function getCentroid(vertices: Point[]): Point;
    function makeSuperTriangle(vertices: Point[], highestCoordinateValue?: number): Triangle;
    function pointsEqual(p1: Point, p2: Point): boolean;
    function edgesEqual(e1: Point[], e2: Point[]): boolean;
}
declare module Rance {
    class MapGen {
        public maxWidth: number;
        public maxHeight: number;
        public points: Rance.Star[];
        public players: Rance.Player[];
        public independents: Rance.Player;
        public regions: {
            [id: string]: {
                id: string;
                points: Rance.Star[];
            };
        };
        public triangles: Rance.Triangle[];
        public voronoiDiagram: any;
        public nonFillerVoronoiLines: {
            [visibility: string]: any[];
        };
        public nonFillerPoints: Rance.Star[];
        public galaxyConstructors: {
            [type: string]: (any: any) => Rance.Star[];
        };
        public startLocations: Rance.Star[];
        constructor();
        public reset(): void;
        public makeMap(options: {
            mapOptions: {
                width: number;
                height?: number;
            };
            starGeneration: {
                galaxyType: string;
                totalAmount: number;
                arms: number;
                centerSize: number;
                amountInCenter: number;
            };
            relaxation: {
                timesToRelax: number;
                dampeningFactor: number;
            };
        }): MapGen;
        public setPlayers(): void;
        public setDistanceFromStartLocations(): void;
        public setupPirates(): void;
        public generatePoints(options: {
            galaxyType: string;
            totalAmount: number;
            arms: number;
            centerSize: number;
            amountInCenter: number;
        }): any;
        public makeRegion(name: string): void;
        public makeSpiralPoints(props: {
            amountPerArm: number;
            arms: number;
            amountInCenter: number;
            centerSize?: number;
            armOffsetMax?: number;
        }): any[];
        public triangulate(): void;
        public clearLinks(): void;
        public makeLinks(): void;
        public severArmLinks(): void;
        public makeVoronoi(): void;
        public cleanTriangles(triangles: Rance.Triangle[], superTriangle: Rance.Triangle): Rance.Triangle[];
        public getVerticesFromCell(cell: any): any[];
        public relaxPointsOnce(dampeningFactor?: number): void;
        public relaxPoints(options: {
            timesToRelax: number;
            dampeningFactor: number;
        }): void;
        public getNonFillerPoints(): Rance.Star[];
        public getNonFillerVoronoiLines(visibleStars?: Rance.Star[]): any[];
        public getFurthestPointInRegion(region: any): Rance.Star;
    }
}
declare module Rance {
    interface IMapRendererLayer {
        drawingFunction: (map: Rance.GalaxyMap) => PIXI.DisplayObjectContainer;
        container: PIXI.DisplayObjectContainer;
        isDirty: boolean;
    }
    interface IMapRendererLayerMapMode {
        name: string;
        layers: {
            layer: IMapRendererLayer;
        }[];
    }
    class MapRenderer {
        public container: PIXI.DisplayObjectContainer;
        public parent: PIXI.DisplayObjectContainer;
        public galaxyMap: Rance.GalaxyMap;
        public player: Rance.Player;
        public game: Rance.Game;
        public occupationShaders: {
            [ownerId: string]: {
                [occupierId: string]: any;
            };
        };
        public layers: {
            [name: string]: IMapRendererLayer;
        };
        public mapModes: {
            [name: string]: IMapRendererLayerMapMode;
        };
        public fowTilingSprite: PIXI.TilingSprite;
        public fowSpriteCache: {
            [starId: number]: PIXI.Sprite;
        };
        public currentMapMode: IMapRendererLayerMapMode;
        public isDirty: boolean;
        constructor(map: Rance.GalaxyMap);
        public init(): void;
        public addEventListeners(): void;
        public setPlayer(player: Rance.Player): void;
        public updateShaderOffsets(x: number, y: number): void;
        public updateShaderZoom(zoom: number): void;
        public makeFowSprite(): void;
        public getFowSpriteForStar(star: Rance.Star): PIXI.Sprite;
        public getOccupationShader(owner: Rance.Player, occupier: Rance.Player): any;
        public initLayers(): void;
        public initMapModes(): void;
        public setParent(newParent: PIXI.DisplayObjectContainer): void;
        public resetContainer(): void;
        public hasLayerInMapMode(layer: IMapRendererLayer): boolean;
        public setLayerAsDirty(layerName: string): void;
        public setAllLayersAsDirty(): void;
        public drawLayer(layer: IMapRendererLayer): void;
        public setMapMode(newMapMode: string): void;
        public render(): void;
    }
}
declare module Rance {
    class GalaxyMap {
        public allPoints: Rance.Star[];
        public stars: Rance.Star[];
        public mapGen: Rance.MapGen;
        public mapRenderer: Rance.MapRenderer;
        public game: Rance.Game;
        constructor();
        public setMapGen(mapGen: Rance.MapGen): void;
        public getIncomeBounds(): {
            min: any;
            max: any;
        };
        public serialize(): any;
    }
}
declare module Rance {
    /**
    * @class Camera
    * @constructor
    */
    class Camera {
        public container: PIXI.DisplayObjectContainer;
        public width: number;
        public height: number;
        public bounds: any;
        public startPos: number[];
        public startClick: number[];
        public currZoom: number;
        public screenWidth: number;
        public screenHeight: number;
        public onMoveCallbacks: {
            (x: number, y: number): void;
        }[];
        public onZoomCallbacks: {
            (zoom: number): void;
        }[];
        /**
        * [constructor description]
        * @param {PIXI.DisplayObjectContainer} container [DOC the camera views and manipulates]
        * @param {number}                      bound     [How much of the container is allowed to leave the camera view.
        * 0.0 to 1.0]
        */
        constructor(container: PIXI.DisplayObjectContainer, bound: number);
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
        public startScroll(mousePos: number[]): void;
        /**
        * @method end
        */
        public end(): void;
        /**
        * @method getDelta
        * @param {number[]} currPos [description]
        */
        private getDelta(currPos);
        /**
        * @method move
        * @param {number[]} currPos [description]
        */
        public move(currPos: number[]): void;
        private onMove();
        public getScreenCenter(): {
            x: number;
            y: number;
        };
        public centerOnPosition(pos: Rance.Point): void;
        /**
        * @method zoom
        * @param {number} zoomAmount [description]
        */
        public zoom(zoomAmount: number): void;
        private onZoom();
        /**
        * @method deltaZoom
        * @param {number} delta [description]
        * @param {number} scale [description]
        */
        public deltaZoom(delta: number, scale: number): void;
        /**
        * @method clampEdges
        * @private
        */
        private clampEdges();
    }
}
declare module Rance {
    class RectangleSelect {
        public parentContainer: PIXI.DisplayObjectContainer;
        public graphics: PIXI.Graphics;
        public selecting: boolean;
        public start: Rance.Point;
        public current: Rance.Point;
        public toSelectFrom: {
            position: Rance.Point;
            data: any;
        }[];
        public getSelectionTargetsFN: () => {
            position: Rance.Point;
            data: any;
        }[];
        constructor(parentContainer: PIXI.DisplayObjectContainer);
        public addEventListeners(): void;
        public startSelection(point: Rance.Point): void;
        public moveSelection(point: Rance.Point): void;
        public endSelection(point: Rance.Point): void;
        public drawSelectionRectangle(): void;
        public setSelectionTargets(): void;
        public getBounds(): {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
            width: number;
            height: number;
        };
        public getAllInSelection(): any[];
        public selectionContains(point: Rance.Point): boolean;
    }
}
declare module Rance {
    class MouseEventHandler {
        public renderer: Rance.Renderer;
        public camera: Rance.Camera;
        public rectangleselect: Rance.RectangleSelect;
        public startPoint: number[];
        public currPoint: number[];
        public currAction: string;
        public stashedAction: string;
        public preventingGhost: boolean;
        constructor(renderer: Rance.Renderer, camera: Rance.Camera);
        public addEventListeners(): void;
        public preventGhost(delay: number): void;
        public mouseDown(event: any, targetType: string): void;
        public mouseMove(event: any, targetType: string): void;
        public mouseUp(event: any, targetType: string): void;
        public startScroll(event: any): void;
        public scrollMove(event: any): void;
        public endScroll(event: any): void;
        public zoomMove(event: any): void;
        public endZoom(event: any): void;
        public startZoom(event: any): void;
        public startSelect(event: any): void;
        public dragSelect(event: any): void;
        public endSelect(event: any): void;
        public hover(event: any): void;
    }
}
declare module Rance {
    class UniformManager {
        public registeredObjects: {
            [uniformType: string]: any[];
        };
        public timeCount: number;
        constructor();
        public registerObject(uniformType: string, shader: any): void;
        public updateTime(): void;
    }
}
declare module Rance {
    module ShaderSources {
        var nebula: string[];
        var starfield: string[];
    }
}
declare module Rance {
    class ShaderManager {
        public shaders: {
            [name: string]: any;
        };
        public uniformManager: Rance.UniformManager;
        constructor();
        public initNebula(): void;
    }
}
declare module Rance {
    class Renderer {
        public stage: PIXI.Stage;
        public renderer: any;
        public pixiContainer: HTMLCanvasElement;
        public layers: {
            [name: string]: PIXI.DisplayObjectContainer;
        };
        public camera: Rance.Camera;
        public mouseEventHandler: Rance.MouseEventHandler;
        public shaderManager: Rance.ShaderManager;
        public isPaused: boolean;
        public forceFrame: boolean;
        public backgroundIsDirty: boolean;
        public isBattleBackground: boolean;
        public blurProps: number[];
        constructor();
        public init(): void;
        public initRenderer(): void;
        public removeRendererView(): void;
        public bindRendererView(container: HTMLCanvasElement): void;
        public initLayers(): void;
        public setupDefaultLayers(): void;
        public setupBackgroundLayers(): void;
        public addCamera(): void;
        public addEventListeners(): void;
        public resize(): void;
        public makeBackgroundTexture(seed?: any): PIXI.Texture;
        public renderNebula(): PIXI.Texture;
        public renderBackground(): void;
        public renderBlurredNebula(x: number, y: number, width: number, height: number, seed?: any): PIXI.Texture;
        public renderOnce(): void;
        public pause(): void;
        public resume(): void;
        public render(): void;
    }
}
declare module Rance {
    class Game {
        public turnNumber: number;
        public independents: Rance.Player[];
        public playerOrder: Rance.Player[];
        public galaxyMap: Rance.GalaxyMap;
        public humanPlayer: Rance.Player;
        public activePlayer: Rance.Player;
        public playerControl: Rance.PlayerControl;
        constructor(map: Rance.GalaxyMap, players: Rance.Player[], humanPlayer: Rance.Player);
        public addEventListeners(): void;
        public endTurn(): void;
        public processPlayerStartTurn(player: Rance.Player): void;
        public setNextPlayer(): void;
        public serialize(): any;
    }
}
declare module Rance {
    interface ISpritesheetData {
        frames: {
            [id: string]: {
                frame: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                };
            };
        };
        meta: any;
    }
    class Loader {
        public loaded: {
            DOM: boolean;
            emblems: boolean;
            other: boolean;
        };
        public startTime: number;
        public onLoaded: any;
        public imageCache: {
            [type: string]: {
                [id: string]: HTMLImageElement;
            };
        };
        constructor(onLoaded: any);
        public spritesheetToDataURLs(sheetData: ISpritesheetData, sheetImg: HTMLImageElement): {
            [id: string]: HTMLImageElement;
        };
        public loadDOM(): void;
        public loadEmblems(): void;
        public loadOther(): void;
        public checkLoaded(): void;
    }
}
declare module Rance {
    interface IMove {
        ability: Rance.Templates.AbilityTemplate;
        targetId: number;
    }
    class MCTreeNode {
        public battle: Rance.Battle;
        public sideId: string;
        public move: IMove;
        public depth: number;
        public parent: MCTreeNode;
        public children: MCTreeNode[];
        public visits: number;
        public wins: number;
        public winRate: number;
        public totalScore: number;
        public averageScore: number;
        public possibleMoves: IMove[];
        public uctEvaluation: number;
        public uctIsDirty: boolean;
        constructor(battle: Rance.Battle, sideId: string, move?: IMove);
        public getPossibleMoves(): any[];
        public addChild(): MCTreeNode;
        public updateResult(result: number): void;
        public simulateOnce(battle: Rance.Battle): void;
        public simulateToEnd(): void;
        public clearResult(): void;
        public setUct(): void;
        public getHighestUctChild(): MCTreeNode;
        public getRecursiveBestUctChild(): any;
    }
}
declare module Rance {
    class MCTree {
        public rootNode: Rance.MCTreeNode;
        constructor(battle: Rance.Battle, sideId: string);
        public sortByWinRateFN(a: Rance.MCTreeNode, b: Rance.MCTreeNode): number;
        public sortByScoreFN(a: Rance.MCTreeNode, b: Rance.MCTreeNode): number;
        public evaluate(iterations: number): Rance.MCTreeNode;
        public printToConsole(): void;
    }
}
declare module Rance {
    class App {
        public seed: any;
        public loader: Rance.Loader;
        public renderer: Rance.Renderer;
        public game: Rance.Game;
        public mapRenderer: Rance.MapRenderer;
        public reactUI: Rance.ReactUI;
        public humanPlayer: Rance.Player;
        public playerControl: Rance.PlayerControl;
        public images: {
            [type: string]: {
                [id: string]: HTMLImageElement;
            };
        };
        constructor();
        public initGame(): Rance.Game;
        public initPlayers(): {
            players: any[];
            independents: Rance.Player;
        };
        public initMap(playerData: any): Rance.GalaxyMap;
        public initDisplay(): void;
        public initUI(): void;
    }
}
declare var app: Rance.App;
