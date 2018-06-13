import {FlatAndMultiplierAdjustment, squashAdjustmentsObjects} from "./FlatAndMultiplierAdjustment";
import
{
  clamp,
} from "./utility";


// TODO 2018.06.05 | why does maxActionPoints belong in this module?
export enum UnitAttribute
{
  Attack,
  Defence,
  Intelligence,
  Speed,
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

export class UnitAttributes implements UnitAttributesObject
{
  public maxActionPoints: number;
  public attack: number;
  public defence: number;
  public intelligence: number;
  public speed: number;

  constructor(initialAttributes: UnitAttributesObject)
  {
    for (const key in initialAttributes)
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
      speed: 0,
    });
  }
  public static squashAdjustments(...toSquash: UnitAttributeAdjustments[]): UnitAttributeAdjustments
  {
    return squashAdjustmentsObjects(...toSquash);
  }

  public clone(): UnitAttributes
  {
    return new UnitAttributes(this);
  }
  public applyAdjustment(adjustment: UnitAttributeAdjustments): UnitAttributes
  {
    for (const attribute in adjustment)
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
  public clamp(min: number, max: number): UnitAttributes
  {
    this.forEachAttribute(attribute =>
    {
      this[attribute] = clamp(this[attribute], min, max);
    });

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
      speed: this.speed - toCompare.speed,
    });
  }
  public getAttributesTypesSortedForDisplay(): (keyof UnitAttributesObject)[]
  {
    return(
    [
      "maxActionPoints",
      "attack",
      "defence",
      "intelligence",
      "speed",
    ]);
  }
  public modifyValueByAttributes(base: number = 0, modifierPerStat: UnitAttributeAdjustments = {}): number
  {
    let totalFlat = base;
    let totalMultiplier = 1;

    for (const attribute in modifierPerStat)
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

  private forEachAttribute(cb: (attribute: keyof UnitAttributesObject) => void): void
  {
    this.getAttributesTypesSortedForDisplay().forEach(attribute =>
    {
      cb(attribute);
    });
  }
}
