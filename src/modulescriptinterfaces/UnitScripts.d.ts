import Unit from "../Unit";

export interface PartialUnitScripts
{
  removeFromPlayer?: ((unit: Unit) => void)[];
}

export interface UnitScripts extends PartialUnitScripts
{
  removeFromPlayer: ((unit: Unit) => void)[];
}

export default UnitScripts;
