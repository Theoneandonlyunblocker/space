/// <reference path="templateinterfaces/iabilitytemplate.d.ts" />
/// <reference path="templateinterfaces/iabilitytemplateeffect.d.ts" />
/// <reference path="templateinterfaces/ibattlesfxtemplate.d.ts" />

/// <reference path="battle.ts"/>
/// <reference path="battlescene.ts" />
/// <reference path="ability.ts"/>

module Rance
{
  export interface IAbilityUseData
  {
    ability: Templates.IAbilityTemplate;
    user: Unit;
    intendedTarget: Unit;
    actualTarget: Unit;
  }
  export interface IAbilityEffectData
  {
    templateEffect?: Templates.IAbilityTemplateEffect;
    callbacksToExecute: {(): void;}[];
    user: Unit;
    target: Unit;
    trigger: (user: Unit, target: Unit) => boolean;
  }
  export interface IUnitChanges
  {
    newHealth: number;
    newGuardAmount: number;
    newGuardType: GuardCoverage;
    isPreparing: boolean;
    isAnnihilated: boolean;
    newActionPoints: number;
    newStatusEffects: StatusEffect[];
  }
  export interface IAbilityUseEffect
  {
    unitChanges:
    {
      [unitId: number]: IUnitChanges;
    }
    sfx: Templates.IBattleSFXTemplate;
    sfxUser: Unit;
    sfxTarget: Unit;
  }

  // IAbilityUseData ->
  // IAbilityUseData with actualTarget ->
  // IAbilityEffectData[] ->
  //   execute IAbilityEffectData[] ->
  // IAbilityUseEffect[]

  /**
   * Processes IAbilityUseData and returns IAbilityEffectData
   * @type {[type]}
   */
  export class BattleAbilityProcessor
  {
    private battle: Battle;
    private battleScene: BattleScene;

    private nullFormation: Unit[][];

    constructor(battle: Battle)
    {
      this.battle = battle;

      this.nullFormation = this.createNullFormation();
    }
    private createNullFormation(): Unit[][]
    {
      var nullFormation: Unit[][] = [];

      var rows = app.moduleData.ruleSet.battle.rowsPerFormation;
      var columns = app.moduleData.ruleSet.battle.cellsPerRow;
      for (var i = 0; i < rows; i++)
      {
        nullFormation.push([]);
        for (var j = 0; j < columns; j++)
        {
          nullFormation[i].push(null);
        }
      }

      return nullFormation;
    }

    public handleAbilityUse(abilityUseData: IAbilityUseData)
    {
      abilityUseData.actualTarget = this.getTargetOrGuard(abilityUseData);
      var abilityEffectsData = this.getAbilityEffectsData(abilityUseData);
    }

    private getTargetOrGuard(abilityUseData: IAbilityUseData): Unit
    {
      if (abilityUseData.ability.bypassesGuard)
      {
        return target;
      }
      
      var guarding = this.getGuarders(abilityUseData);

      guarding = guarding.sort(function(a: Unit, b: Unit)
      {
        return a.battleStats.guardAmount - b.battleStats.guardAmount;
      });

      for (var i = 0; i < guarding.length; i++)
      {
        var guardRoll = Math.random() * 100;
        if (guardRoll <= guarding[i].battleStats.guardAmount)
        {
          return guarding[i];
        }
      }

      return abilityUseData.intendedTarget;
    }
    private getGuarders(abilityUseData: IAbilityUseData): Unit[]
    {
      var userSide = abilityUseData.user.battleStats.side;
      var targetSide = abilityUseData.intendedTarget.battleStats.side;

      if (userSide === targetSide) return [];

      var allEnemies = battle.unitsBySide[targetSide];

      var guarders = allEnemies.filter(function(unit: Unit)
      {
        if (!unit.isTargetable) return false;
        
        if (unit.battleStats.guardCoverage === GuardCoverage.all)
        {
          return unit.battleStats.guardAmount > 0;
        }
        else if (unit.battleStats.guardCoverage === GuardCoverage.row)
        {
          // same row
          if (unit.battleStats.position[0] === target.battleStats.position[0])
          {
            return unit.battleStats.guardAmount > 0;
          }
        }
      });

      return guarders;
    }

    private getFormationsToTarget(user: unit, effect: IEffectTemplate): Unit[][]
    {
      if (effect.targetFormation === TargetFormation.either)
      {
        return this.battle.side1.concat(this.battle.side2);
      }
      else
      {
        var userSide = user.battleStats.side;
        var insertNullBefore = (userSide === "side1") ? false : true;
        var toConcat: Unit[][];
      }

      if (effect.targetFormation === TargetFormation.ally)
      {
        toConcat = battle[userSide];
      }
      else if (effect.targetFormation === TargetFormation.enemy)
      {
        toConcat = battle[reverseSide(userSide)];
      }
      else
      {
        throw new Error("Invalid target formation for effect: " + effect.name);
      }

      if (insertNullBefore)
      {
        return nullFormation.concat(toConcat);
      }
      else
      {
        return toConcat.concat(nullFormation);
      }
    }

    private static activeUnitsFilterFN(unit: Unit)
    {
      return unit && unit.isActiveInBattle();
    }
    private getUnitsInEffectArea(effect: Templates.IEffectTemplate, user: Unit, target: Unit): Unit[]
    {
      var targetFormations = this.getFormationsToTarget(user, effect);

      var inArea = effect.battleAreaFunction(targetFormations, target);

      return inArea.filter(BattleAbilityUser.activeUnitsFilterFN);
    }
    private getAbilityEffectData(effect: Templates.IEffectTemplate, user: unit, target: Unit): IAbilityEffectData
    {
      var boundEffect = effect.template.effect.bind(null, user, target, this.battle, effect.data);
      return(
      {
        
      });
    }

    private getAbilityEffectsData(abilityUseData: IAbilityUseData): IAbilityEffectData[]
    {
    }
    private getBeforeAbilityUseEffectData(abilityUseData: IAbilityUseData): IAbilityEffectData[]
    {
      var abilityUser = abilityUseData.user;
      var abilityTarget = abilityUseData.actualTarget;

      var effectData: IAbilityEffectData[] = [];

      var beforeUseEffects: Templates.IAbilityTemplateEffect[] = [];
      if (ability.beforeUse)
      {
        beforeUseEffects = beforeUseEffects.concat(ability.beforeUse);
      }

      var passiveSkills = abilityUser.getPassiveSkillsByPhase().beforeAbilityUse;
      if (passiveSkills)
      {
        for (var i = 0; i < passiveSkills.length; i++)
        {
          beforeUseEffects = beforeUseEffects.concat(passiveSkills[i].beforeAbilityUse);
        }
      }

      // remove action points
      // beforeUseEffects
      for (var i = 0; i < beforeUseEffects.length; i++)
      {
        var templateEffect = beforeUseEffects[i];
        var targetsForEffect = this.getUnitsInEffectArea(
          templateEffect.template, abilityUser, abilityTarget);

        for (var j = 0; j < targetsForEffect.length; j++)
        {
          effectData.push(
          {
            templateEffect: templateEffect,
            callbacksToExecute:
            user: abilityUser,
            target: targetsForEffect[j],
            trigger: templateEffect.trigger
          });
        }
      }
      // remove guard

      return effectData;
    }
  }
}
