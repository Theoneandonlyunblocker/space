/// <reference path="templateinterfaces/iabilitytemplate.d.ts" />
/// <reference path="templateinterfaces/iabilityeffecttemplate.d.ts" />
/// <reference path="templateinterfaces/ibattlesfxtemplate.d.ts" />

/// <reference path="battle.ts"/>
/// <reference path="battlescene.ts" />

module Rance
{
  export interface IAbilityUseDataNEW
  {
    ability: Templates.IAbilityTemplate;
    user: Unit;
    intendedTarget: Unit;
    actualTarget: Unit;
  }
  export interface IAbilityEffectData
  {
    templateEffect: Templates.IAbilityEffectTemplate;
    user: Unit;
    target: Unit;
    trigger: (user: Unit, target: Unit) => boolean;
  }
  export interface IAbilityEffectDataByPhase
  {
    beforeUse: IAbilityEffectData[];
    abilityEffects: IAbilityEffectData[];
    afterUse: IAbilityEffectData[];
  }
  export interface IAbilityUseSystemAction
  {
    executeSystemAction: () => void;
  }

  // IAbilityUseDataNEW ->
  // IAbilityUseDataNEW with actualTarget ->
  // IAbilityEffectData[] ->
  //   execute IAbilityEffectData[] ->
  // IAbilityUseEffect[]

  /**
   * Processes IAbilityUseDataNEW and returns IAbilityEffectDataByPhase
   */
  export class BattleAbilityProcessor
  {
    private battle: Battle;
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

    public destroy()
    {
      this.battle = null;
    }
    
    public getAbilityEffectDataByPhase(abilityUseData: IAbilityUseDataNEW): IAbilityEffectDataByPhase
    {
      abilityUseData.actualTarget = this.getTargetOrGuard(abilityUseData);

      var beforeUse = this.getAbilityEffectDataFromEffectTemplates(
        abilityUseData,
        this.getBeforeAbilityUseEffectTemplates(abilityUseData)
      );

      var abilityEffects = this.getAbilityEffectDataFromEffectTemplates(
        abilityUseData,
        this.getAbilityUseEffectTemplates(abilityUseData)
      );

      var afterUse = this.getAbilityEffectDataFromEffectTemplates(
        abilityUseData,
        this.getAfterAbilityUseEffectTemplates(abilityUseData)
      );

      return(
      {
        beforeUse: beforeUse,
        abilityEffects: abilityEffects,
        afterUse: afterUse
      });
    }

    private getTargetOrGuard(abilityUseData: IAbilityUseDataNEW): Unit
    {
      if (abilityUseData.ability.bypassesGuard)
      {
        return abilityUseData.intendedTarget;
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
    private getGuarders(abilityUseData: IAbilityUseDataNEW): Unit[]
    {
      var userSide = abilityUseData.user.battleStats.side;
      var targetSide = abilityUseData.intendedTarget.battleStats.side;

      if (userSide === targetSide) return [];

      var allEnemies = this.battle.unitsBySide[targetSide];

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
          if (unit.battleStats.position[0] === abilityUseData.intendedTarget.battleStats.position[0])
          {
            return unit.battleStats.guardAmount > 0;
          }
        }
      });

      return guarders;
    }

    private getFormationsToTarget(user: Unit, effect: Templates.IEffectActionTemplate): Unit[][]
    {
      if (effect.targetFormations === TargetFormation.either)
      {
        return this.battle.side1.concat(this.battle.side2);
      }
      else
      {
        var userSide = user.battleStats.side;
        var insertNullBefore = (userSide === "side1") ? false : true;
        var toConcat: Unit[][];
      }

      if (effect.targetFormations === TargetFormation.ally)
      {
        toConcat = this.battle[userSide];
      }
      else if (effect.targetFormations === TargetFormation.enemy)
      {
        toConcat = this.battle[reverseSide(userSide)];
      }
      else
      {
        throw new Error("Invalid target formation for effect: " + effect.name);
      }

      if (insertNullBefore)
      {
        return this.nullFormation.concat(toConcat);
      }
      else
      {
        return toConcat.concat(this.nullFormation);
      }
    }

    private static activeUnitsFilterFN(unit: Unit)
    {
      return unit && unit.isActiveInBattle();
    }
    private getUnitsInEffectArea(effect: Templates.IEffectActionTemplate, user: Unit, target: Unit): Unit[]
    {
      var targetFormations = this.getFormationsToTarget(user, effect);

      var inArea = effect.battleAreaFunction(targetFormations, target.battleStats.position);

      return inArea.filter(BattleAbilityProcessor.activeUnitsFilterFN);
    }

    private getAbilityEffectDataFromEffectTemplates(abilityUseData: IAbilityUseDataNEW,
      effectTemplates: Templates.IAbilityEffectTemplate[]): IAbilityEffectData[]
    {
      var effectData: IAbilityEffectData[] = [];

      for (var i = 0; i < effectTemplates.length; i++)
      {
        var templateEffect = effectTemplates[i];
        var targetsForEffect = this.getUnitsInEffectArea(
          templateEffect.action, abilityUseData.user, abilityUseData.actualTarget);

        for (var j = 0; j < targetsForEffect.length; j++)
        {
          effectData.push(
          {
            templateEffect: templateEffect,
            user: abilityUseData.user,
            target: targetsForEffect[j],
            trigger: templateEffect.trigger
          });
        }
      }

      return effectData;
    }
    private getBeforeAbilityUseEffectTemplates(abilityUseData: IAbilityUseDataNEW): Templates.IAbilityEffectTemplate[]
    {
      var beforeUseEffects: Templates.IAbilityEffectTemplate[] = [];
      if (abilityUseData.ability.beforeUse)
      {
        beforeUseEffects = beforeUseEffects.concat(abilityUseData.ability.beforeUse);
      }

      var passiveSkills = abilityUseData.user.getPassiveSkillsByPhase().beforeAbilityUse;
      if (passiveSkills)
      {
        for (var i = 0; i < passiveSkills.length; i++)
        {
          beforeUseEffects = beforeUseEffects.concat(passiveSkills[i].beforeAbilityUse);
        }
      }

      return beforeUseEffects;
      // TODO remove guard & action points
    }
    private getAbilityUseEffectTemplates(abilityUseData: IAbilityUseDataNEW): Templates.IAbilityEffectTemplate[]
    {
      var effects: Templates.IAbilityEffectTemplate[] = [];
      effects.push(abilityUseData.ability.mainEffect);

      if (abilityUseData.ability.secondaryEffects)
      {
        effects = effects.concat(abilityUseData.ability.secondaryEffects);
      }

      return effects;
    }
    private getAfterAbilityUseEffectTemplates(abilityUseData: IAbilityUseDataNEW): Templates.IAbilityEffectTemplate[]
    {
      var afterUseEffects: Templates.IAbilityEffectTemplate[] = [];
      if (abilityUseData.ability.afterUse)
      {
        afterUseEffects = afterUseEffects.concat(abilityUseData.ability.afterUse);
      }

      var passiveSkills = abilityUseData.user.getPassiveSkillsByPhase().afterAbilityUse;
      if (passiveSkills)
      {
        for (var i = 0; i < passiveSkills.length; i++)
        {
          afterUseEffects = afterUseEffects.concat(passiveSkills[i].afterAbilityUse);
        }
      }

      return afterUseEffects;
      // TODO add move delay & update status effects
    }
  }
}
