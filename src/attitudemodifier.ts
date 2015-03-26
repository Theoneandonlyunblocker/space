module Rance
{
  export class AttitudeModifier
  {
    type: string;
    startTurn: number;
    endTurn: number;
    strength: number;

    constructor(props:
    {
      type: string;
      startTurn: number;
      endTurn: number;
      strength: number;
    })
    {
      this.type: props.type;
      this.startTurn: props.startTurn;
      this.endTurn: props.endTurn;
      this.strength: props.strength;
    }

    getFreshness(currentTurn: number)
    {
      if (this.endTurn < 0) return 1;
      else
      {
        return 1 - getRelativeValue(currentTurn, this.startTurn, this.endTurn);
      }
    }
    getAdjustedStrength(currentTurn: number)
    {
      var freshenss = this.getFreshness();

      return this.strength * freshenss;
    }
  }
}
