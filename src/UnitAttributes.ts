// TODO 2018.06.05 | why does maxActionPoints belong in this module?
import
{
  FlatAndMultiplierAdjustment,
  squashAdjustmentsObjects,
  getBaseAdjustment,
  applyFlatAndMultiplierAdjustments,
} from "./FlatAndMultiplierAdjustment";
import
{
  clamp,
} from "./utility";


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

export function getUnitAttributesObjectKeyForAttribute(attribute: UnitAttribute): Exclude<keyof UnitAttributesObject, "maxActionPoints">
{
  switch (attribute)
  {
    case UnitAttribute.Attack: return "attack";
    case UnitAttribute.Defence: return "defence";
    case UnitAttribute.Intelligence: return "intelligence";
    case UnitAttribute.Speed: return "speed";
  }
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
  private static getBaseAdjustmentsObject(): UnitAttributeAdjustments
  {
    return(
    {
      maxActionPoints: getBaseAdjustment(),
      attack: getBaseAdjustment(),
      defence: getBaseAdjustment(),
      intelligence: getBaseAdjustment(),
      speed: getBaseAdjustment(),
    });
  }

  public clone(): UnitAttributes
  {
    return new UnitAttributes(this);
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
    const baseAdjustments = UnitAttributes.getBaseAdjustmentsObject();
    const squashedAdjustments = squashAdjustmentsObjects(baseAdjustments, ...adjustments);

    const cloned = this.clone();
    cloned.applyAdjustments(squashedAdjustments);

    return cloned;
  }
  public modifyValueByAttributes(
    baseValue: number,
    attributeAdjustments: UnitAttributeAdjustments,
  ): number
  {
    const totalAdjustment = getBaseAdjustment();

    for (const attributeName in attributeAdjustments)
    {
      const adjustment = attributeAdjustments[<keyof UnitAttributeAdjustments>attributeName];
      const attributeValue = this[<keyof UnitAttributeAdjustments>attributeName];

      if (adjustment.flat)
      {
        totalAdjustment.flat += adjustment.flat * attributeValue;
      }
      if (adjustment.additiveMultiplier)
      {
        totalAdjustment.additiveMultiplier += adjustment.additiveMultiplier * attributeValue;
      }
      if (isFinite(adjustment.multiplicativeMultiplier))
      {
        totalAdjustment.multiplicativeMultiplier *= adjustment.multiplicativeMultiplier * attributeValue;
      }
    }

    return applyFlatAndMultiplierAdjustments(baseValue, totalAdjustment);
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
  public serialize(): UnitAttributesObject
  {
    return JSON.parse(JSON.stringify(this));
  }

  private applyAdjustments(adjustments: UnitAttributeAdjustments): UnitAttributes
  {
    for (const attribute in adjustments)
    {
      this[attribute] = applyFlatAndMultiplierAdjustments(this[attribute], adjustments[attribute]);
    }

    return this;
  }
  private forEachAttribute(cb: (attribute: keyof UnitAttributesObject) => void): void
  {
    this.getAttributesTypesSortedForDisplay().forEach(attribute =>
    {
      cb(attribute);
    });
  }
}
