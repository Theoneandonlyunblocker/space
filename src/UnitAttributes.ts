import FlatAndMultiplierAdjustment from "./FlatAndMultiplierAdjustment";
import Item from "./Item";
import StatusEffect from "./StatusEffect";
import
{
  clamp
} from "./utility";

// https://github.com/Microsoft/TypeScript/issues/7485
export interface PartialUnitAttributes
{
  maxActionPoints?: number;
  attack?: number;
  defence?: number;
  intelligence?: number;
  speed?: number;
}

// https://github.com/Microsoft/TypeScript/issues/7485
export interface UnitAttributeAdjustments
{
  // [attribute: string]: FlatAndMultiplierAdjustment;
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
  private static squashAdjustments(toSquash: UnitAttributeAdjustments[]): UnitAttributeAdjustments
  {
    const squashed: UnitAttributeAdjustments = {};

    toSquash.forEach(adjustment =>
    {
      for (let attribute in adjustment)
      {
        if (!squashed[attribute])
        {
          squashed[attribute] = {};
        }

        if (adjustment[attribute].flat)
        {
          squashed[attribute].flat = 0 + adjustment[attribute].flat;
        }
        if (isFinite(adjustment[attribute].multiplier))
        {
          if (!isFinite(squashed[attribute].multiplier))
          {
            squashed[attribute].multiplier = 1;
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
        this[attribute] *= adjustment[attribute].multiplier;
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
  public getAdjustedAttributes(adjustments: UnitAttributeAdjustments[]): UnitAttributes
  {
    const squashedAdjustments = UnitAttributes.squashAdjustments(adjustments);

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
  public serialize(): UnitAttributesObject
  {
    return JSON.parse(JSON.stringify(this));
  }
}
