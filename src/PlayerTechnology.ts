
import {activeModuleData} from "./activeModuleData";
import eventManager from "./eventManager";
import PlayerTechnologySaveData from "./savedata/PlayerTechnologySaveData";
import RaceTechnologyValue from "./templateinterfaces/RaceTechnologyValue";
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate";

export default class PlayerTechnology
{
  technologies:
  {
    [technologyKey: string]:
    {
      technology: TechnologyTemplate;
      totalResearch: number;
      level: number;
      maxLevel: number;
      priority: number;
      priorityIsLocked: boolean;
    },
  };
  tempOverflowedResearchAmount: number = 0;
  getResearchSpeed: () => number;

  constructor(getResearchSpeed: () => number, raceTechnologyValues: RaceTechnologyValue[],
    savedData?: PlayerTechnologySaveData)
  {
    this.getResearchSpeed = getResearchSpeed;

    this.technologies = {};

    raceTechnologyValues.forEach(raceValue =>
    {
      const techKey = raceValue.tech.key;
      const technology = activeModuleData.Templates.Technologies[techKey];

      this.technologies[techKey] =
      {
        technology: technology,
        totalResearch: 0,
        level: 0,
        maxLevel: raceValue.maxLevel,
        priority: undefined,
        priorityIsLocked: false,
      };

      if (savedData && savedData[techKey])
      {
        this.addResearchTowardsTechnology(technology, savedData[techKey].totalResearch);
        this.technologies[techKey].priority = savedData[techKey].priority;
        this.technologies[techKey].priorityIsLocked = savedData[techKey].priorityIsLocked;
      }
      else
      {
        this.technologies[techKey].level = raceValue.startingLevel;
        this.technologies[techKey].totalResearch =
          this.getResearchNeededForTechnologyLevel(raceValue.startingLevel);
      }
    });

    this.initPriorities();
  }
  initPriorities()
  {
    let priorityToAllocate: number = 1;
    const techsToInit: TechnologyTemplate[] = [];

    for (let key in this.technologies)
    {
      const techData = this.technologies[key];
      if (techData.priority === undefined)
      {
        techsToInit.push(techData.technology);
      }
      else
      {
        priorityToAllocate -= techData.priority;
      }
    }

    techsToInit.sort((a, b) =>
    {
      return this.technologies[b.key].maxLevel - this.technologies[a.key].maxLevel;
    });

    while (techsToInit.length > 0)
    {
      const averagePriority = priorityToAllocate / techsToInit.length;

      const technology = techsToInit.pop();

      const maxNeededPriority = this.getMaxNeededPriority(technology);
      const priorityForTech = Math.min(averagePriority, maxNeededPriority);

      this.technologies[technology.key].priority = priorityForTech;
      priorityToAllocate -= priorityForTech;
    }
  }
  allocateResearchPoints(amount: number, iteration: number = 0): void
  {
    // probably not needed as priority should always add up to 1 anyway,
    // but this is cheap and infrequently called so this is here as a safeguard at least for now
    let totalPriority: number = 0;
    for (let key in this.technologies)
    {
      totalPriority += this.technologies[key].priority;
    }


    for (let key in this.technologies)
    {
      const techData = this.technologies[key];
      const relativePriority = techData.priority / totalPriority;
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
    const overflow = this.tempOverflowedResearchAmount;
    this.tempOverflowedResearchAmount = 0;
    this.allocateResearchPoints(overflow, ++iteration);

  }
  getResearchNeededForTechnologyLevel(level: number): number
  {
    if (level <= 0) return 0;
    if (level === 1) return 40;

    let a = 20;
    let b = 40;
    let swap: number;

    let total = 0;

    for (let i = 0; i < level; i++)
    {
      swap = a;
      a = b;
      b = swap + b;
      total += a;
    }

    return total;
  }
  addResearchTowardsTechnology(technology: TechnologyTemplate, amount: number): void
  {
    const tech = this.technologies[technology.key];
    let overflow: number = 0;

    if (tech.level >= tech.maxLevel) // probably shouldnt happen in the first place
    {
      return;
    }
    else
    {
      tech.totalResearch += amount;
      while (tech.level < tech.maxLevel &&
        this.getResearchNeededForTechnologyLevel(tech.level + 1) <= tech.totalResearch)
      {
        tech.level++;
      }
      if (tech.level === tech.maxLevel)
      {
        const neededForMaxLevel = this.getResearchNeededForTechnologyLevel(tech.level);
        overflow += tech.totalResearch - neededForMaxLevel;
        tech.totalResearch -= overflow;
        this.setTechnologyPriority(technology, 0, true);
        tech.priorityIsLocked = true;
      }
    }

    this.tempOverflowedResearchAmount += overflow;
  }
  getMaxNeededPriority(technology: TechnologyTemplate)
  {
    const tech = this.technologies[technology.key];

    const researchUntilMaxed =
      this.getResearchNeededForTechnologyLevel(tech.maxLevel) - tech.totalResearch;

    return researchUntilMaxed / this.getResearchSpeed();
  }
  getOpenTechnologiesPriority()
  {
    let openPriority = 0;

    for (let key in this.technologies)
    {
      const techData = this.technologies[key];
      if (!techData.priorityIsLocked)
      {
        openPriority += techData.priority;
      }
    }

    return openPriority;
  }
  getRelativeOpenTechnologyPriority(technology: TechnologyTemplate)
  {
    const totalOpenPriority = this.getOpenTechnologiesPriority();
    if (this.technologies[technology.key].priorityIsLocked || !totalOpenPriority)
    {
      return 0;
    }

    return this.technologies[technology.key].priority / totalOpenPriority;
  }
  setTechnologyPriority(technology: TechnologyTemplate, priority: number, force: boolean = false)
  {
    let remainingPriority = 1;

    let totalOtherPriority: number = 0;
    let totalOtherPriorityWasZero: boolean = false;
    let totalOthersCount: number = 0;
    for (let key in this.technologies)
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

    const priorityNeededForMaxLevel = this.getMaxNeededPriority(technology);
    const maxNeededPriority = Math.min(priorityNeededForMaxLevel, priority);

    this.technologies[technology.key].priority = maxNeededPriority;
    remainingPriority -= maxNeededPriority;


    if (totalOtherPriority === 0)
    {
      totalOtherPriority = 1;
      totalOtherPriorityWasZero = true;
    }

    for (let key in this.technologies)
    {
      if (key !== technology.key && !this.technologies[key].priorityIsLocked)
      {
        const techData = this.technologies[key];
        if (totalOtherPriorityWasZero)
        {
          techData.priority = 1 / totalOthersCount;
        }

        const maxNeededPriorityForOtherTech = this.getMaxNeededPriority(techData.technology);

        const relativePriority = techData.priority / totalOtherPriority;
        const reservedPriority = relativePriority * remainingPriority;

        if (reservedPriority > maxNeededPriorityForOtherTech)
        {
          techData.priority = maxNeededPriorityForOtherTech;
          const priorityOverflow = reservedPriority - maxNeededPriorityForOtherTech;
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
    let overflowPriority: number = 0;

    for (let key in this.technologies)
    {
      const techData = this.technologies[key];

      const maxNeededPriorityForOtherTech = this.getMaxNeededPriority(techData.technology);
      if (techData.priority > maxNeededPriorityForOtherTech)
      {
        overflowPriority += techData.priority - maxNeededPriorityForOtherTech;

        this.setTechnologyPriority(techData.technology, maxNeededPriorityForOtherTech, true);
        break;
      }
    }
  }
  serialize(): PlayerTechnologySaveData
  {
    const data: PlayerTechnologySaveData = {};

    for (let key in this.technologies)
    {
      data[key] =
      {
        totalResearch: this.technologies[key].totalResearch,
        priority: this.technologies[key].priority,
        priorityIsLocked: this.technologies[key].priorityIsLocked,
      };
    }

    return data;
  }
}
