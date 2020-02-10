export interface IdGeneratorValues
{
  fleet: number;
  item: number;
  player: number;
  star: number;
  unit: number;
  building: number;
  objective: number;
  combatEffect: number;
  notification: number;
}

class IdGenerator implements IdGeneratorValues
{
  public fleet: number = 0;
  public item: number = 0;
  public player: number = 0;
  public star: number = 0;
  public unit: number = 0;
  public building: number = 0;
  public objective: number = 0;
  public combatEffect: number = 0;
  public notification: number = 0;

  constructor()
  {

  }
  public setValues(newValues: IdGeneratorValues)
  {
    for (const key in newValues)
    {
      this[key] = newValues[key];
    }
  }
  public serialize(): IdGeneratorValues
  {
    return(
    {
      fleet: this.fleet,
      item: this.item,
      player: this.player,
      star: this.star,
      unit: this.unit,
      building: this.building,
      objective: this.objective,
      combatEffect: this.combatEffect,
      notification: this.notification,
    });
  }
}

export const idGenerators = new IdGenerator();
