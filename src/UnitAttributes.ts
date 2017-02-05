import FlatAndMultiplierAdjustment from "./FlatAndMultiplierAdjustment";
import
{
  clamp
} from "./utility";

export enum UnitAttribute
{
  attack,
  defence,
  intelligence,
  speed,
}

export interface PartialUnitAttributes
{
  maxActionPoints?: number;
  attack?: number;
  defence?: number;
  intelligence?: number;
  speed?: number;
}

export interface UnitAttributeAdjustments
{
  maxActionPoints?: FlatAndMultiplierAdjustment;
  attack?: FlatAndMultiplierAdjustment;
  defence?: FlatAndMultiplierAdjustment;
  intelligence?: FlatAndMultiplierAdjustment;
  speed?: FlatAndMultiplierAdjustment;
}

export interface UnitAttributesObject
{
  maxActionPoints: number;
  attack: number;
  defence: number;
  intelligence: number;
  speed: number;
}

export default class UnitAttributes implements UnitAttributesObject
{
  public maxActionPoints: number;
  public attack: number;
  public defence: number;
  public intelligence: number;
  public speed: number;

  constructor(initialAttributes: UnitAttributesObject)
  {
    for (let key in initialAttributes)
    {
      this[key] = initialAttributes[key];
    }
  }

  public static createBlank(): UnitAttributes
  {
    return new UnitAttributes(
    {
      maxActionPoints: 0,
      attack: 0,
      defence: 0,
      intelligence: 0,
      speed: 0
    });
  }
  public static squashAdjustments(...toSquash: UnitAttributeAdjustments[]): UnitAttributeAdjustments
  {
    const squashed: UnitAttributeAdjustments = {};

    toSquash.forEach((adjustment) =>
    {
      for (let attribute in adjustment)
      {
        if (!squashed[attribute])
        {
          squashed[attribute] = {};
        }

        if (adjustment[attribute].flat)
        {
          if (!isFinite(squashed[attribute].flat))
          {
            squashed[attribute].flat = 0;
          }

          squashed[attribute].flat += adjustment[attribute].flat;
        }
        if (isFinite(adjustment[attribute].multiplier))
        {
          if (!isFinite(squashed[attribute].multiplier))
          {
            squashed[attribute].multiplier = 0;
          }

          squashed[attribute].multiplier += adjustment[attribute].multiplier;
        }
      }
    });

    return squashed;
  }

  public clone(): UnitAttributes
  {
    return new UnitAttributes(this);
  }
  public applyAdjustment(adjustment: UnitAttributeAdjustments): UnitAttributes
  {
    for (let attribute in adjustment)
    {
      if (adjustment[attribute].flat)
      {
        this[attribute] += adjustment[attribute].flat;
      }
      if (isFinite(adjustment[attribute].multiplier))
      {
        this[attribute] *= 1 + adjustment[attribute].multiplier;
      }
    }

    return this;
  }
  public clamp(min?: number, max?: number): UnitAttributes
  {
    for (let attribute in this)
    {
      this[attribute] = clamp(this[attribute], min, max);
    }

    return this;
  }
  public getAdjustedAttributes(...adjustments: UnitAttributeAdjustments[]): UnitAttributes
  {
    const squashedAdjustments = UnitAttributes.squashAdjustments(...adjustments);

    const cloned = this.clone();
    cloned.applyAdjustment(squashedAdjustments);

    return cloned;
  }
  public getDifferenceBetween(toCompare: UnitAttributes): UnitAttributes
  {
    return new UnitAttributes(
    {
      maxActionPoints: this.maxActionPoints - toCompare.maxActionPoints,
      attack: this.attack - toCompare.attack,
      defence: this.defence - toCompare.defence,
      intelligence: this.intelligence - toCompare.intelligence,
      speed: this.speed - toCompare.speed
    });
  }
  public getAttributesTypesSortedForDisplay(): string[]
  {
    const attributeTypes: string[] = [];

    const attributes = this.serialize();
    for (let attribute in attributes)
    {
      attributeTypes.push(attribute);
    }

    const sortOrder =
    {
      maxActionPoints: 0,
      attack: 1,
      defence: 2,
      intelligence: 3,
      speed: 4
    }

    const sorted = attributeTypes.sort((a, b) =>
    {
      return sortOrder[a] - sortOrder[b];
    });

    return sorted;
  }
  public modifyValueByAttributes(base: number = 0, modifierPerStat: UnitAttributeAdjustments = {}): number
  {
    let totalFlat = base;
    let totalMultiplier = 1;

    for (let attribute in modifierPerStat)
    {
      const flatAdjustment = modifierPerStat[attribute].flat || 0;
      totalFlat += flatAdjustment * this[attribute];
      
      const multiplier = modifierPerStat[attribute].multiplier || 0;
      totalMultiplier += multiplier * this[attribute];
    }

    return totalFlat * totalMultiplier;
  }
  public serialize(): UnitAttributesObject
  {
    return JSON.parse(JSON.stringify(this));
  }
}
