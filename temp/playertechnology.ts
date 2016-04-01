/// <reference path="savedata/iplayertechnologysavedata.d.ts" />

export class PlayerTechnology
{
  technologies:
  {
    [technologyKey: string]:
    {
      technology: Templates.ITechnologyTemplate;
      totalResearch: number;
      level: number;
      priority: number;
      priorityIsLocked: boolean;
    }
  };
  tempOverflowedResearchAmount: number = 0;
  getResearchSpeed: () => number;

  constructor(getResearchSpeed: () => number, savedData?:
    {[key: string]: {totalResearch: number; priority: number; priorityIsLocked: boolean}})
  {
    this.getResearchSpeed = getResearchSpeed;

    this.technologies = {};

    var totalTechnologies = Object.keys(app.moduleData.Templates.Technologies).length;
    for (var key in app.moduleData.Templates.Technologies)
    {
      var technology = app.moduleData.Templates.Technologies[key]
      this.technologies[key] =
      {
        technology: technology,
        totalResearch: 0,
        level: 0,
        priority: undefined,
        priorityIsLocked: false
      }

      if (savedData && savedData[key])
      {
        this.addResearchTowardsTechnology(technology, savedData[key].totalResearch);
        this.technologies[key].priority = savedData[key].priority;
        this.technologies[key].priorityIsLocked = savedData[key].priorityIsLocked;
      }
    }

    this.initPriorities();
  }
  initPriorities()
  {
    var priorityToAllocate: number = 1;
    var techsToInit: Templates.ITechnologyTemplate[] = [];

    for (var key in this.technologies)
    {
      var techData = this.technologies[key];
      if (techData.priority === undefined)
      {
        techsToInit.push(techData.technology);
      }
      else
      {
        priorityToAllocate -= techData.priority;
      }
    }

    techsToInit.sort(function(a: Templates.ITechnologyTemplate, b: Templates.ITechnologyTemplate)
    {
      return b.maxLevel - a.maxLevel;
    });

    while (techsToInit.length > 0)
    {
      var averagePriority = priorityToAllocate / techsToInit.length;

      var technology = techsToInit.pop();

      var maxNeededPriority = this.getMaxNeededPriority(technology);
      var priorityForTech = Math.min(averagePriority, maxNeededPriority);

      this.technologies[technology.key].priority = priorityForTech;
      priorityToAllocate -= priorityForTech;
    }
  }
  allocateResearchPoints(amount: number, iteration: number = 0): void
  {
    // probably not needed as priority should always add up to 1 anyway,
    // but this is cheap and infrequently called so this is here as a safeguard at least for now
    var totalPriority: number = 0;
    for (var key in this.technologies)
    {
      totalPriority += this.technologies[key].priority;
    }


    for (var key in this.technologies)
    {
      var techData = this.technologies[key];
      var relativePriority = techData.priority / totalPriority;
      if (relativePriority > 0)
      {
        this.addResearchTowardsTechnology(techData.technology, relativePriority * amount);
      }
    }

    if (this.tempOverflowedResearchAmount)
    {
      if (iteration > 10)
      {
        throw new RangeError("Maximum call stack size exceeded");
      }
      this.allocateOverflowedResearchPoints(iteration);
    }
    else
    {
      this.capTechnologyPrioritiesToMaxNeeded();
    }
  }
  allocateOverflowedResearchPoints(iteration: number = 0)
  {
    var overflow = this.tempOverflowedResearchAmount;
    this.tempOverflowedResearchAmount = 0;
    this.allocateResearchPoints(overflow, ++iteration);

  }
  getResearchNeededForTechnologyLevel(level: number): number
  {
    if (level <= 0) return 0;
    if (level === 1) return 40;

    var a = 20;
    var b = 40;
    var swap: number;

    var total = 0;

    for (var i = 0; i < level; i++)
    {
      swap = a;
      a = b;
      b = swap + b;
      total += a;
    }

    return total;
  }
  addResearchTowardsTechnology(technology: Templates.ITechnologyTemplate, amount: number): void
  {
    var tech = this.technologies[technology.key]
    var overflow: number = 0;

    if (tech.level >= technology.maxLevel) // probably shouldnt happen in the first place
    {
      return;
    }
    else
    {
      tech.totalResearch += amount;
      while (tech.level < technology.maxLevel &&
        this.getResearchNeededForTechnologyLevel(tech.level + 1) <= tech.totalResearch)
      {
        tech.level++;
      }
      if (tech.level === technology.maxLevel)
      {
        var neededForMaxLevel = this.getResearchNeededForTechnologyLevel(tech.level);
        overflow += tech.totalResearch - neededForMaxLevel;
        tech.totalResearch -= overflow;
        this.setTechnologyPriority(technology, 0, true);
        tech.priorityIsLocked = true;
      }
    }

    this.tempOverflowedResearchAmount += overflow;
  }
  getMaxNeededPriority(technology: Templates.ITechnologyTemplate)
  {
    var researchUntilMaxed = this.getResearchNeededForTechnologyLevel(technology.maxLevel) -
      this.technologies[technology.key].totalResearch;

    return researchUntilMaxed / this.getResearchSpeed();
  }
  getOpenTechnologiesPriority()
  {
    var openPriority = 0;

    for (var key in this.technologies)
    {
      var techData = this.technologies[key];
      if (!techData.priorityIsLocked)
      {
        openPriority += techData.priority;
      }
    }

    return openPriority;
  }
  getRelativeOpenTechnologyPriority(technology: Templates.ITechnologyTemplate)
  {
    var totalOpenPriority = this.getOpenTechnologiesPriority();
    if (this.technologies[technology.key].priorityIsLocked || !totalOpenPriority)
    {
      return 0;
    }
    
    return this.technologies[technology.key].priority / totalOpenPriority;
  }
  setTechnologyPriority(technology: Templates.ITechnologyTemplate, priority: number, force: boolean = false)
  {
    var remainingPriority = 1;

    var totalOtherPriority: number = 0;
    var totalOtherPriorityWasZero: boolean = false;
    var totalOthersCount: number = 0;
    for (var key in this.technologies)
    {
      if (key !== technology.key)
      {
        if (this.technologies[key].priorityIsLocked)
        {
          remainingPriority -= this.technologies[key].priority;
        }
        else
        {
          totalOtherPriority += this.technologies[key].priority;
          totalOthersCount++;
        }
      }
    }
    if (totalOthersCount === 0)
    {
      if (force)
      {
        this.technologies[technology.key].priority = priority;
        eventManager.dispatchEvent("technologyPrioritiesUpdated");
      }

      return;
    }

    if (remainingPriority < 0.0001)
    {
      remainingPriority = 0;
    }

    if (priority > remainingPriority)
    {
      priority = remainingPriority;
    }

    var priorityNeededForMaxLevel = this.getMaxNeededPriority(technology);
    var maxNeededPriority = Math.min(priorityNeededForMaxLevel, priority);

    this.technologies[technology.key].priority = maxNeededPriority;
    remainingPriority -= maxNeededPriority;


    if (totalOtherPriority === 0)
    {
      totalOtherPriority = 1;
      totalOtherPriorityWasZero = true;
    }

    for (var key in this.technologies)
    {
      if (key !== technology.key && !this.technologies[key].priorityIsLocked)
      {
        var techData = this.technologies[key];
        if (totalOtherPriorityWasZero)
        {
          techData.priority = 1 / totalOthersCount;
        }

        var maxNeededPriorityForOtherTech = this.getMaxNeededPriority(techData.technology);

        var relativePriority = techData.priority / totalOtherPriority;
        var reservedPriority = relativePriority * remainingPriority;

        if (reservedPriority > maxNeededPriorityForOtherTech)
        {
          techData.priority = maxNeededPriorityForOtherTech;
          var priorityOverflow = reservedPriority - maxNeededPriorityForOtherTech;
          remainingPriority += priorityOverflow;
        }
        else
        {
          techData.priority = reservedPriority;
        }
      }
    }

    eventManager.dispatchEvent("technologyPrioritiesUpdated");
  }
  capTechnologyPrioritiesToMaxNeeded()
  {
    var overflowPriority: number = 0;

    for (var key in this.technologies)
    {
      var techData = this.technologies[key];

      var maxNeededPriorityForOtherTech = this.getMaxNeededPriority(techData.technology);
      if (techData.priority > maxNeededPriorityForOtherTech)
      {
        overflowPriority += techData.priority - maxNeededPriorityForOtherTech;

        this.setTechnologyPriority(techData.technology, maxNeededPriorityForOtherTech, true);
        break;
      }
    }
  }
  serialize(): IPlayerTechnologySaveData
  {
    var data: IPlayerTechnologySaveData = {};

    for (var key in this.technologies)
    {
      data[key] =
      {
        totalResearch: this.technologies[key].totalResearch,
        priority: this.technologies[key].priority,
        priorityIsLocked: this.technologies[key].priorityIsLocked
      }
    }

    return data;
  }
}
