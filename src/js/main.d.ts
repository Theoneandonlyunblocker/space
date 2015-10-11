/// <reference path="../../lib/pixi.d.ts" />
/// <reference path="../../lib/tween.js.d.ts" />
/// <reference path="../../lib/react.d.ts" />
/// <reference path="../templateinterfaces/iresourcetemplate.d.ts" />
/// <reference path="../templateinterfaces/idistributable.d.ts" />
/// <reference path="../templateinterfaces/ibuildingtemplate.d.ts" />
/// <reference path="../templateinterfaces/iabilitytemplate.d.ts" />
/// <reference path="../templateinterfaces/iabilitytemplateeffect.d.ts" />
/// <reference path="../templateinterfaces/ibattlesfxtemplate.d.ts" />
/// <reference path="../templateinterfaces/iitemtemplate.d.ts" />
/// <reference path="../templateinterfaces/istatuseffecttemplate.d.ts" />
/// <reference path="../templateinterfaces/iunittemplate.d.ts" />
/// <reference path="../../lib/husl.d.ts" />
/// <reference path="../../lib/rng.d.ts" />
/// <reference path="../templateinterfaces/isubemblemtemplate.d.ts" />
/// <reference path="../templateinterfaces/iattitudemodifiertemplate.d.ts" />
/// <reference path="../../lib/voronoi.d.ts" />
/// <reference path="../../lib/quadtree.d.ts" />
/// <reference path="../templateinterfaces/inotificationtemplate.d.ts" />
/// <reference path="../templateinterfaces/imapgentemplate.d.ts" />
/// <reference path="../templateinterfaces/imaprendererlayertemplate.d.ts" />
/// <reference path="../templateinterfaces/imaprenderermapmodetemplate.d.ts" />
/// <reference path="../../lib/offset.d.ts" />
/// <reference path="../templateinterfaces/iunitfamily.d.ts" />
/// <reference path="../templateinterfaces/mapgenoptions.d.ts" />
/// <reference path="../templateinterfaces/itechnologytemplate.d.ts" />
/// <reference path="../templateinterfaces/ieffecttemplate.d.ts" />
/// <reference path="../templateinterfaces/sfxparams.d.ts" />
/// <reference path="../templateinterfaces/idefencebuildingtemplate.d.ts" />
/// <reference path="../templateinterfaces/ipassiveskilltemplate.d.ts" />
/// <reference path="../templateinterfaces/ibattleprepeffect.d.ts" />
/// <reference path="../templateinterfaces/iturnstarteffect.d.ts" />
/// <reference path="../templateinterfaces/istatuseffectattributeadjustment.d.ts" />
/// <reference path="../templateinterfaces/istatuseffectattributes.d.ts" />
/// <reference path="../templateinterfaces/iunitarchetype.d.ts" />
/// <reference path="../templateinterfaces/iunitdrawingfunction.d.ts" />
/// <reference path="../templateinterfaces/ispritetemplate.d.ts" />
/// <reference path="../templateinterfaces/iobjectivetemplate.d.ts" />
/// <reference path="../tutorials/tutorial.d.ts" />
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
            setContainerRect: () => void;
            updateDOMNodeStyle: () => void;
            componentWillMount: () => void;
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
        var PlayerFlag: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var BattleScore: React.Factory<any>;
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
        var UpgradeAbilities: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UpgradeAttributes: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UpgradeUnit: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitExperience: React.Factory<{}>;
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
        var DefenceBuilding: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var DefenceBuildingList: React.Factory<any>;
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
        var TechnologyPrioritySlider: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var Technology: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TechnologiesList: React.Factory<{}>;
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Resources {
                    var testResource1: Rance.Templates.IResourceTemplate;
                    var testResource2: Rance.Templates.IResourceTemplate;
                    var testResource3: Rance.Templates.IResourceTemplate;
                    var testResource4: Rance.Templates.IResourceTemplate;
                    var testResource5: Rance.Templates.IResourceTemplate;
                }
            }
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
    enum DamageType {
        physical = 0,
        magical = 1,
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
    function getRandomProperty(target: {
        [props: string]: any;
    }): any;
    function getRandomKeyWithWeights(target: {
        [prop: string]: number;
    }): any;
    function getRandomArrayItemWithWeights<T extends {
        weight?: number;
    }>(arr: T[]): T;
    function getFrom2dArray(target: any[][], arr: number[][]): any[];
    function flatten2dArray(toFlatten: any[][]): any[];
    function reverseSide(side: string): string;
    function turnOrderSortFunction(a: Unit, b: Unit): number;
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
    function getItemsFromWeightedProbabilities<T>(probabilities: Templates.IWeightedProbability<T>[]): T[];
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
        getEffect(effect?: Templates.IBuildingEffect): {};
        getPossibleUpgrades(): IBuildingUpgradeData[];
        upgrade(): void;
        setController(newController: Player): void;
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
        getGainedExperiencePerSide(): {
            side1: number;
            side2: number;
        };
        checkBattleEnd(): boolean;
        makeVirtualClone(): Battle;
    }
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
    interface IAbilityUseDataEffect {
        effects: {
            (): void;
        }[];
        user: Unit;
        target: Unit;
        sfx: Templates.IBattleSFXTemplate;
        trigger: (user: Unit, target: Unit) => boolean;
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
    function getPreparationDummyData(user: Unit): IAbilityUseData;
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
    class Item {
        id: number;
        template: Templates.IItemTemplate;
        unit: Unit;
        constructor(template: Templates.IItemTemplate, id?: number);
        serialize(): any;
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
            queuedAction: {
                ability: Templates.IAbilityTemplate;
                targetId: number;
                turnsPrepared: number;
                timesInterrupted: number;
            };
        };
        abilities: Templates.IAbilityTemplate[];
        passiveSkills: Templates.IPassiveSkillTemplate[];
        experienceForCurrentLevel: number;
        level: number;
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
        cachedBattleScene: HTMLCanvasElement;
        cachedBattleScenePropsString: string;
        lastHealthDrawnAt: number;
        front: MapAI.Front;
        constructor(template: Templates.IUnitTemplate, id?: number, data?: any);
        makeFromData(data: any): void;
        setInitialValues(): void;
        setBaseHealth(multiplier?: number): void;
        setAttributes(baseSkill?: number, variance?: number): void;
        getBaseMoveDelay(): number;
        resetMovePoints(): void;
        resetBattleStats(): void;
        setBattlePosition(battle: Battle, side: string, position: number[]): void;
        addStrength(amount: number): void;
        removeStrength(amount: number): void;
        removeActionPoints(amount: number): void;
        addMoveDelay(amount: number): void;
        updateStatusEffects(): void;
        setQueuedAction(ability: Templates.IAbilityTemplate, target: Unit): void;
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
        getTotalStatusEffectAttributeAdjustments(): Templates.IStatusEffectAttributes;
        getAttributesWithEffects(): any;
        updateCachedAttributes(): void;
        removeItemAtSlot(slot: string): boolean;
        setInitialAbilities(): void;
        setInitialPassiveSkills(): void;
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
        getTotalCost(): number;
        getTurnsToReachStar(star: Star): number;
        drawBattleScene(props: Templates.IUnitDrawingFunctionProps): HTMLCanvasElement;
        getExperienceToNextLevel(): number;
        addExperience(amount: number): void;
        canLevelUp(): boolean;
        handleLevelUp(): void;
        hasAbility(ability: Templates.IAbilityBase, allAbilities: Templates.IAbilityBase[]): boolean;
        getLearnableAbilities(allAbilities: Templates.IAbilityBase[]): Templates.IAbilityBase[];
        canUpgradeIntoAbility(ability: Templates.IAbilityBase, allAbilities: Templates.IAbilityBase[]): boolean;
        getAbilityUpgradeData(): {
            [source: string]: {
                base: Templates.IAbilityBase;
                possibleUpgrades: Templates.IAbilityBase[];
            };
        };
        upgradeAbility(source: Templates.IAbilityBase, newAbility: Templates.IAbilityBase): void;
        serialize(includeItems?: boolean): any;
        makeVirtualClone(): Unit;
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
        inner: Templates.ISubEmblemTemplate;
        outer: Templates.ISubEmblemTemplate;
        constructor(color: number, alpha?: number, inner?: Templates.ISubEmblemTemplate, outer?: Templates.ISubEmblemTemplate);
        generateRandom(minAlpha: number, rng?: any): void;
        canAddOuterTemplate(): boolean;
        getPossibleSubEmblemsToAdd(): Templates.ISubEmblemTemplate[];
        generateSubEmblems(rng: any): void;
        canAddBackground(): boolean;
        drawSubEmblem(toDraw: Templates.ISubEmblemTemplate, maxWidth: number, maxHeight: number, stretch: boolean): HTMLCanvasElement;
        draw(maxWidth: number, maxHeight: number, stretch: boolean): HTMLCanvasElement;
        serialize(): any;
    }
}
declare module Rance {
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
        constructor(battle: Battle, move?: IMove);
        getPossibleMoves(): IMove[];
        addChild(possibleMovesIndex?: number): MCTreeNode;
        getChildForMove(move: IMove): MCTreeNode;
        updateResult(result: number): void;
        pickRandomAbilityAndTarget(actions: {
            [targetId: number]: Templates.IAbilityTemplate[];
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
declare module Rance {
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
declare module Rance {
    class BattleSimulator {
        battle: Battle;
        tree: MCTree;
        hasEnded: boolean;
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
        forEachShipInFormation(formation: Unit[][], operator: (unit: Unit) => any): void;
        makeBattle(): Battle;
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
        refresh(newModifier: AttitudeModifier): void;
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
        listeners: {
            [name: string]: Function[];
        };
        constructor(player: Player);
        addEventListeners(): void;
        destroy(): void;
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
        triggerAttitudeModifier(template: Templates.IAttitudeModifierTemplate, player: Player, source: Player): void;
        processAttitudeModifiersForPlayer(player: Player, evaluation: IDiplomacyEvaluation): void;
        serialize(): any;
    }
}
declare module Rance {
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
            manufacturable: Templates.IUnitTemplate[];
            potential: Templates.IUnitTemplate[];
        };
        getLocalItemTypes(): {
            manufacturable: Templates.IItemTemplate[];
            potential: Templates.IItemTemplate[];
        };
        getManufacturableThingsForType(type: string): IManufacturableThing[];
        canManufactureThing(template: IManufacturableThing, type: string): boolean;
        handleOwnerChange(): void;
        getCapacityUpgradeCost(): number;
        upgradeCapacity(amount: number): void;
        getUnitUpgradeCost(): number;
        upgradeUnitStatsModifier(amount: number): void;
        upgradeUnitHealthModifier(amount: number): void;
        serialize(): {
            capacity: number;
            maxCapacity: number;
            unitStatsModifier: number;
            unitHealthModifier: number;
            buildQueue: {
                type: string;
                templateType: string;
            }[];
        };
    }
}
declare module Rance {
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
declare module Rance {
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
declare module Rance {
    class Notification {
        template: Templates.INotificationTemplate;
        props: any;
        turn: number;
        hasBeenRead: boolean;
        constructor(template: Templates.INotificationTemplate, props: any, turn: number);
        makeMessage(): string;
        serialize(): any;
    }
}
declare module Rance {
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
        constructor();
        addEventListeners(): void;
        destroy(): void;
        setTurn(turn: number, isHumanTurn: boolean): void;
        makeNotification(template: Templates.INotificationTemplate, props: any): void;
        addNotification(notification: Notification): void;
        markAsRead(notification: Notification): void;
        getUnreadNotificationsForTurn(turn: number): Notification[];
        serialize(): any[];
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
        notificationLog: NotificationLog;
        gameStorageKey: string;
        constructor(map: GalaxyMap, players: Player[], humanPlayer: Player);
        destroy(): void;
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
        seed: string;
        independents: Player[];
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
    module MapAI {
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
            evaluateDesirabilityOfPlayersStars(player: Player): number;
            getIndependentNeighborStars(): Star[];
            getIndependentNeighborStarIslands(earlyReturnSize?: number): Star[];
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
declare module Rance {
    module MapAI {
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
declare module Rance {
    module MapAI {
        class Objective {
            id: number;
            template: Templates.IObjectiveTemplate;
            type: string;
            private _basePriority;
            priority: number;
            isOngoing: boolean;
            target: Star;
            targetPlayer: Player;
            constructor(template: Templates.IObjectiveTemplate, priority: number, target: Star, targetPlayer?: Player);
            getUnitsDesired(): {
                min: number;
                ideal: number;
            };
        }
    }
}
declare module Rance {
    module MapAI {
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
            getNewObjectivesOfType(objectiveTemplate: Templates.IObjectiveTemplate): Objective[];
            setObjectivesOfType(objectiveTemplate: Templates.IObjectiveTemplate): void;
            getObjectivesByTarget(objectiveType: string, markAsOngoing: boolean): {
                [targetString: string]: Objective;
            };
            getObjectivesWithTemplateProperty(propKey: string): Objective[];
            getAdjustmentsForTemplateProperty(propKey: string): IRoutineAdjustmentByTargetId;
        }
    }
}
declare module Rance {
    module MapAI {
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
declare module Rance {
    module MapAI {
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
declare module Rance {
    module MapAI {
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
declare module Rance {
    module MapAI {
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
declare module Rance {
    module MapAI {
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
declare module Rance {
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
        technologies: {
            [technologyKey: string]: {
                technology: Templates.ITechnologyTemplate;
                totalResearch: number;
                level: number;
                priority: number;
                priorityIsLocked: boolean;
            };
        };
        constructor(isAI: boolean, id?: number);
        destroy(): void;
        initTechnologies(savedData?: {
            [key: string]: {
                totalResearch: number;
                priority: number;
                priorityIsLocked: boolean;
            };
        }): void;
        makeColorScheme(): void;
        setupAI(game: Game): void;
        setupPirates(): void;
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
        addResource(resource: Templates.IResourceTemplate, amount: number): void;
        getResourceIncome(): {
            [resourceType: string]: {
                resource: Templates.IResourceTemplate;
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
        attackTarget(location: Star, target: any, battleFinishCallback?: any): void;
        getResearchSpeed(): number;
        allocateResearchPoints(): void;
        getResearchNeededForTechnologyLevel(level: number): number;
        addResearchTowardsTechnology(technology: Templates.ITechnologyTemplate, amount: number): void;
        setTechnologyPriority(technology: Templates.ITechnologyTemplate, priority: number): void;
        getAllManufactories(): Manufactory[];
        meetsTechnologyRequirements(requirements: Templates.ITechnologyRequirement[]): boolean;
        getGloballyBuildableUnits(): Templates.IUnitTemplate[];
        getGloballyBuildableItems(): Templates.IItemTemplate[];
        getManufacturingCapacityFor(template: IManufacturableThing, type: string): number;
        serialize(): any;
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
        buildingsEffect: Templates.IBuildingEffect;
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
        buildableUnitTypes: Templates.IUnitTemplate[];
        manufactory: Manufactory;
        constructor(x: number, y: number, id?: number);
        severLinksToNonAdjacent(): void;
        getBuildableShipTypes(): Templates.IUnitTemplate[];
        addBuilding(building: Building): void;
        removeBuilding(building: Building): void;
        sortDefenceBuildings(): void;
        getSecondaryController(): Player;
        updateController(): void;
        updateBuildingsEffect(): void;
        getBuildingsEffect(): Templates.IBuildingEffect;
        getEffectWithBuildingsEffect(base: number, effectType: string): any;
        getIncome(): any;
        getResourceIncome(): {
            resource: Templates.IResourceTemplate;
            amount: any;
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
        getAllFleets(): Fleet[];
        getFleetIndex(fleet: Fleet): number;
        hasFleet(fleet: Fleet): boolean;
        addFleet(fleet: Fleet): boolean;
        addFleets(fleets: Fleet[]): void;
        removeFleet(fleet: Fleet): boolean;
        removeFleets(fleets: Fleet[]): void;
        getAllShipsOfPlayer(player: Player): Unit[];
        getAllShips(): Unit[];
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
        serialize(): any;
    }
}
declare module Rance {
    module UIComponents {
        var ManufactoryStarsListItem: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufactoryStarsList: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufacturableThingsListItem: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufacturableThingsList: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufactoryUpgradeButton: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var BuildQueue: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufacturableUnits: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufacturableItems: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ManufacturableThings: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ConstructManufactory: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var ProductionOverview: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var TopMenuPopup: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TopMenuPopups: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var TopMenu: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var PlayerMoney: React.Factory<any>;
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
        var StarInfo: React.Factory<any>;
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
        var MapRendererLayersListItem: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var MapRendererLayersList: React.Factory<any>;
    }
}
declare module Rance {
    module UIComponents {
        var Notification: React.Factory<{}>;
    }
}
declare module Rance {
    module UIComponents {
        var NotificationLog: React.Factory<any>;
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
        lastSelectedFleetsIds: {
            [fleetId: number]: boolean;
        };
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
        hasFleetSelectionChanged(newFleets: Fleet[]): boolean;
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
    class MapRendererLayer {
        template: IMapRendererLayerTemplate;
        container: PIXI.Container;
        isDirty: boolean;
        private _alpha;
        alpha: number;
        constructor(template: IMapRendererLayerTemplate);
        draw(map: GalaxyMap, mapRenderer: MapRenderer): void;
    }
}
declare module Rance {
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
    }
}
declare module Rance {
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
declare module Rance {
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
        var guard: string[];
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
        galaxyMap: GalaxyMap;
        constructor(galaxyMap: GalaxyMap);
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
        renderBackground(): void;
        renderBlurredBackground(x: number, y: number, width: number, height: number, seed: string): PIXI.Sprite;
        renderOnce(): void;
        pause(): void;
        resume(): void;
        render(renderLoopId?: number): void;
    }
}
declare module Rance {
    interface ITemplates {
        Abilities: {
            [type: string]: Templates.IAbilityTemplate;
        };
        AttitudeModifiers: {
            [type: string]: Templates.IAttitudeModifierTemplate;
        };
        BattleSFX: {
            [type: string]: Templates.IAbilityTemplate;
        };
        Buildings: {
            [type: string]: Templates.IBuildingTemplate;
        };
        Effects: {
            [type: string]: Templates.IEffectTemplate;
        };
        Items: {
            [type: string]: Templates.IItemTemplate;
        };
        MapGen: {
            [type: string]: Templates.IMapGenTemplate;
        };
        MapRendererLayers: {
            [layerKey: string]: IMapRendererLayerTemplate;
        };
        MapRendererMapModes: {
            [mapModeKey: string]: IMapRendererMapModeTemplate;
        };
        Notifications: {
            [key: string]: Templates.INotificationTemplate;
        };
        Objectives: {
            [key: string]: Templates.IObjectiveTemplate;
        };
        PassiveSkills: {
            [type: string]: Templates.IPassiveSkillTemplate;
        };
        Personalities: {
            [type: string]: IPersonality;
        };
        Resources: {
            [type: string]: Templates.IResourceTemplate;
        };
        StatusEffects: {
            [type: string]: Templates.IStatusEffectTemplate;
        };
        SubEmblems: {
            [type: string]: Templates.ISubEmblemTemplate;
        };
        Technologies: {
            [key: string]: Templates.ITechnologyTemplate;
        };
        UnitArchetypes: {
            [type: string]: Templates.IUnitArchetype;
        };
        UnitFamilies: {
            [type: string]: Templates.IUnitFamily;
        };
        Units: {
            [type: string]: Templates.IUnitTemplate;
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
        defaultMap: Templates.IMapGenTemplate;
        constructor();
        copyTemplates(source: any, category: string): void;
        copyAllTemplates(source: any): void;
        addSubModule(moduleFile: IModuleFile): void;
        getDefaultMap(): Templates.IMapGenTemplate;
    }
}
declare module Rance {
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
    }
}
declare module Rance {
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
declare module Rance {
    module Modules {
        module DefaultModule {
            function drawNebula(seed: string, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer): PIXI.Sprite;
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module MapRendererLayers {
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
declare module Rance {
    module Modules {
        module DefaultModule {
            module MapRendererMapModes {
                var defaultMapMode: IMapRendererMapModeTemplate;
                var noStatic: IMapRendererMapModeTemplate;
                var income: IMapRendererMapModeTemplate;
                var influence: IMapRendererMapModeTemplate;
                var resources: IMapRendererMapModeTemplate;
            }
        }
    }
}
declare module Rance {
    module MapGen2 {
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
declare module Rance {
    module MapGen2 {
        class Sector {
            id: number;
            stars: Star[];
            distributionFlags: string[];
            resourceType: Templates.IResourceTemplate;
            resourceLocation: Star;
            addedDistributables: Templates.IDistributable[];
            constructor(id: number);
            addStar(star: Star): void;
            addResource(resource: Templates.IResourceTemplate): void;
            getNeighboringStars(): Star[];
            getNeighboringSectors(): Sector[];
            getMajorityRegions(): Region[];
            getPerimeterLengthWithStar(star: Star): number;
            setupIndependents(player: Player, intensity?: number, variance?: number): void;
        }
    }
}
declare module Rance {
    module MapGen2 {
        function linkAllStars(stars: Star[]): void;
        function partiallyCutLinks(stars: Star[], minConnections: number, maxCutsPerRegion: number): void;
        function calculateConnectedness(stars: Star[], maxRange: number): void;
        function makeSectors(stars: Star[], minSize: number, maxSize: number): {
            [sectorId: number]: Sector;
        };
        function setSectorDistributionFlags(sectors: Sector[]): void;
        function distributeDistributablesPerSector(sectors: Sector[], distributableType: string, allDistributables: any, placerFunction: (sector: Sector, distributable: Templates.IDistributable) => void): void;
        function addDefenceBuildings(star: Star, amount?: number, addSectorCommand?: boolean): void;
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module MapGenFunctions {
                function spiralGalaxyGeneration(options: Rance.Templates.IMapGenOptionValues, players: Player[]): MapGen2.MapGenResult;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module MapGen {
                    var spiralGalaxy: Rance.Templates.IMapGenTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module MapGen {
                    var tinierSpiralGalaxy: Rance.Templates.IMapGenTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Technologies {
                    var stealth: Rance.Templates.ITechnologyTemplate;
                    var lasers: Rance.Templates.ITechnologyTemplate;
                    var missiles: Rance.Templates.ITechnologyTemplate;
                    var test1: Rance.Templates.ITechnologyTemplate;
                    var test2: Rance.Templates.ITechnologyTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module BattleSFXFunctions {
                function makeSprite(imgSrc: string, props: Rance.Templates.SFXParams): HTMLCanvasElement;
                function makeVideo(videoSrc: string, props: Rance.Templates.SFXParams): HTMLCanvasElement;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Effects {
                    var singleTargetDamage: Rance.Templates.IEffectTemplate;
                    var closeAttack: Rance.Templates.IEffectTemplate;
                    var wholeRowAttack: Rance.Templates.IEffectTemplate;
                    var bombAttack: Rance.Templates.IEffectTemplate;
                    var guardColumn: Rance.Templates.IEffectTemplate;
                    var receiveCounterAttack: Rance.Templates.IEffectTemplate;
                    var increaseCaptureChance: Rance.Templates.IEffectTemplate;
                    var buffTest: Rance.Templates.IEffectTemplate;
                    var healTarget: Rance.Templates.IEffectTemplate;
                    var healSelf: Rance.Templates.IEffectTemplate;
                    var standBy: Rance.Templates.IEffectTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module BattleSFXFunctions {
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
                }, params: Rance.Templates.SFXParams): HTMLCanvasElement;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module BattleSFXFunctions {
                function rocketAttack(params: Rance.Templates.SFXParams): HTMLCanvasElement;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module BattleSFXFunctions {
                function guard(props: Rance.Templates.SFXParams): HTMLCanvasElement;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module BattleSFX {
                    var rocketAttack: Rance.Templates.IBattleSFXTemplate;
                    var guard: Rance.Templates.IBattleSFXTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Abilities {
                    var rangedAttack: Rance.Templates.IAbilityTemplate;
                    var closeAttack: Rance.Templates.IAbilityTemplate;
                    var wholeRowAttack: Rance.Templates.IAbilityTemplate;
                    var bombAttack: Rance.Templates.IAbilityTemplate;
                    var guardColumn: Rance.Templates.IAbilityTemplate;
                    var boardingHook: Rance.Templates.IAbilityTemplate;
                    var debugAbility: Rance.Templates.IAbilityTemplate;
                    var ranceAttack: Rance.Templates.IAbilityTemplate;
                    var standBy: Rance.Templates.IAbilityTemplate;
                }
            }
        }
    }
}
declare module Rance {
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
    module Modules {
        module DefaultModule {
            module Templates {
                module AttitudeModifiers {
                    var neighborStars: Rance.Templates.IAttitudeModifierTemplate;
                    var atWar: Rance.Templates.IAttitudeModifierTemplate;
                    var declaredWar: Rance.Templates.IAttitudeModifierTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Buildings {
                    var sectorCommand: Rance.Templates.IDefenceBuildingTemplate;
                    var sectorCommand1: Rance.Templates.IDefenceBuildingTemplate;
                    var sectorCommand2: Rance.Templates.IDefenceBuildingTemplate;
                    var starBase: Rance.Templates.IDefenceBuildingTemplate;
                    var commercialPort: Rance.Templates.IBuildingTemplate;
                    var deepSpaceRadar: Rance.Templates.IBuildingTemplate;
                    var itemManufactory: Rance.Templates.IBuildingTemplate;
                    var resourceMine: Rance.Templates.IBuildingTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module PassiveSkills {
                    var autoHeal: Rance.Templates.IPassiveSkillTemplate;
                    var poisoned: Rance.Templates.IPassiveSkillTemplate;
                    var overdrive: Rance.Templates.IPassiveSkillTemplate;
                    var initialGuard: Rance.Templates.IPassiveSkillTemplate;
                    var warpJammer: Rance.Templates.IPassiveSkillTemplate;
                    var medic: Rance.Templates.IPassiveSkillTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Items {
                    var bombLauncher1: Rance.Templates.IItemTemplate;
                    var bombLauncher2: Rance.Templates.IItemTemplate;
                    var bombLauncher3: Rance.Templates.IItemTemplate;
                    var afterBurner1: Rance.Templates.IItemTemplate;
                    var afterBurner2: Rance.Templates.IItemTemplate;
                    var afterBurner3: Rance.Templates.IItemTemplate;
                    var shieldPlating1: Rance.Templates.IItemTemplate;
                    var shieldPlating2: Rance.Templates.IItemTemplate;
                    var shieldPlating3: Rance.Templates.IItemTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module StatusEffects {
                    var test: Rance.Templates.IStatusEffectTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module SubEmblems {
                    var Aguila_explayada_2: Rance.Templates.ISubEmblemTemplate;
                    var Berliner_Baer: Rance.Templates.ISubEmblemTemplate;
                    var Cles_en_sautoir: Rance.Templates.ISubEmblemTemplate;
                    var Coa_Illustration_Cross_Bowen_3: Rance.Templates.ISubEmblemTemplate;
                    var Coa_Illustration_Cross_Malte_1: Rance.Templates.ISubEmblemTemplate;
                    var Coa_Illustration_Elements_Planet_Moon: Rance.Templates.ISubEmblemTemplate;
                    var Couronne_heraldique_svg: Rance.Templates.ISubEmblemTemplate;
                    var Gomaisasa: Rance.Templates.ISubEmblemTemplate;
                    var Gryphon_Segreant: Rance.Templates.ISubEmblemTemplate;
                    var Heraldic_pentacle: Rance.Templates.ISubEmblemTemplate;
                    var Japanese_Crest_Futatsudomoe_1: Rance.Templates.ISubEmblemTemplate;
                    var Japanese_Crest_Hana_Hisi: Rance.Templates.ISubEmblemTemplate;
                    var Japanese_Crest_Mitsumori_Janome: Rance.Templates.ISubEmblemTemplate;
                    var Japanese_Crest_Oda_ka: Rance.Templates.ISubEmblemTemplate;
                    var Japanese_crest_Tsuki_ni_Hoshi: Rance.Templates.ISubEmblemTemplate;
                    var Japanese_Crest_Ume: Rance.Templates.ISubEmblemTemplate;
                    var Mitsuuroko: Rance.Templates.ISubEmblemTemplate;
                    var Musubikashiwa: Rance.Templates.ISubEmblemTemplate;
                    var Takeda_mon: Rance.Templates.ISubEmblemTemplate;
                    var threeHorns: Rance.Templates.ISubEmblemTemplate;
                    var Flag_of_Edward_England: Rance.Templates.ISubEmblemTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module UnitArchetypes {
                    var combat: Rance.Templates.IUnitArchetype;
                    var utility: Rance.Templates.IUnitArchetype;
                    var scouting: Rance.Templates.IUnitArchetype;
                    var defence: Rance.Templates.IUnitArchetype;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module UnitFamilies {
                    var debug: Rance.Templates.IUnitFamily;
                    var basic: Rance.Templates.IUnitFamily;
                    var red: Rance.Templates.IUnitFamily;
                    var blue: Rance.Templates.IUnitFamily;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            var defaultUnitScene: Rance.Templates.IUnitDrawingFunction;
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Templates {
                module Units {
                    var cheatShip: Rance.Templates.IUnitTemplate;
                    var fighterSquadron: Rance.Templates.IUnitTemplate;
                    var bomberSquadron: Rance.Templates.IUnitTemplate;
                    var battleCruiser: Rance.Templates.IUnitTemplate;
                    var scout: Rance.Templates.IUnitTemplate;
                    var stealthShip: Rance.Templates.IUnitTemplate;
                    var shieldBoat: Rance.Templates.IUnitTemplate;
                    var redShip: Rance.Templates.IUnitTemplate;
                    var blueShip: Rance.Templates.IUnitTemplate;
                }
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module AIUtils {
                interface IScoresByStar {
                    [starId: number]: {
                        star: Star;
                        score: number;
                    };
                }
                function moveToRoutine(front: MapAI.Front, afterMoveCallback: Function, getMoveTargetFN?: (fleet: Fleet) => Star): void;
                function musterAndAttackRoutine(front: MapAI.Front, afterMoveCallback: Function): void;
                function defaultUnitDesireFN(front: MapAI.Front): number;
                function defaultUnitFitFN(unit: Unit, front: MapAI.Front, lowHealthThreshhold?: number, healthAdjust?: number, distanceAdjust?: number): number;
                function scoutingUnitDesireFN(front: MapAI.Front): number;
                function scoutingUnitFitFN(unit: Unit, front: MapAI.Front): number;
                function mergeScoresByStar(merged: IScoresByStar, scores: {
                    star: Star;
                    score: number;
                }[]): IScoresByStar;
                function makeObjectivesFromScores(template: Rance.Templates.IObjectiveTemplate, evaluationScores: {
                    star?: Star;
                    player?: Player;
                    score: number;
                }[], basePriority: number): MapAI.Objective[];
                function perimeterObjectiveCreation(templateKey: string, isForScouting: boolean, basePriority: number, grandStrategyAI: MapAI.GrandStrategyAI, mapEvaluator: MapAI.MapEvaluator, objectivesAI: MapAI.ObjectivesAI): MapAI.Objective[];
                function getUnitsToFillIndependentObjective(objective: MapAI.Objective): {
                    min: number;
                    ideal: number;
                };
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var discovery: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var heal: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var expansion: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var cleanUpPirates: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var scoutingPerimeter: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var declareWar: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Objectives {
                var expandManufactoryCapacity: Rance.Templates.IObjectiveTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module UIComponents {
                var BattleFinishNotification: React.Factory<{}>;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Notifications {
                var battleFinishNotification: Rance.Templates.INotificationTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module UIComponents {
                var WarDeclarationNotification: React.Factory<{}>;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            module Notifications {
                var WarDeclarationNotification: Rance.Templates.INotificationTemplate;
            }
        }
    }
}
declare module Rance {
    module Modules {
        module DefaultModule {
            var moduleFile: IModuleFile;
        }
    }
}
declare module Rance {
    module Modules {
        module TestModule {
            module BuildingTemplates {
                var commercialPortTest1: Rance.Templates.IBuildingTemplate;
                var commercialPortTest2: Rance.Templates.IBuildingTemplate;
                var commercialPortTest3: Rance.Templates.IBuildingTemplate;
                var commercialPortTest4: Rance.Templates.IBuildingTemplate;
                var commercialPortTest5: Rance.Templates.IBuildingTemplate;
                var commercialPortTest6: Rance.Templates.IBuildingTemplate;
                var commercialPortTest7: Rance.Templates.IBuildingTemplate;
            }
            var moduleFile: IModuleFile;
        }
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
        deserializeNotificationLog(data: any[]): NotificationLog;
        deserializeMap(data: any): GalaxyMap;
        deserializeStar(data: any): Star;
        deserializeBuildings(data: any): void;
        deserializeBuilding(data: any): Building;
        deserializePlayer(data: any): Player;
        deserializeDiplomacyStatus(player: Player, data: any): void;
        deserializeIdentifiedUnits(player: Player, data: number[]): void;
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
    function buildTemplateIndexes(): void;
    module TemplateIndexes {
        var distributablesByDistributionGroup: {
            [groupName: string]: {
                unitFamilies: Templates.IUnitFamily[];
                resources: Templates.IResourceTemplate[];
            };
        };
        var itemsByTechLevel: {
            [techLevel: number]: Templates.IItemTemplate[];
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
        var display: {
            borderWidth: number;
        };
    }
    var Options: any;
}
declare module Rance {
    module Tutorials {
        var uiTutorial: {
            pages: (string | React.Descriptor<React.DomAttributes>)[];
        };
    }
}
declare var manufactoryData: {
    startingCapacity: number;
    maxCapacity: number;
    buildCost: number;
};
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
declare var app: Rance.App;
