// base interface for passive skills and status effects
// only used for display

declare interface UnitPassiveEffect
{
  type: string;
  displayName: string;
  description?: string;
  isHidden?: boolean;
}

export default UnitPassiveEffect;
