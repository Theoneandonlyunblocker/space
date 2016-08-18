import Unit from "./Unit";

export default function evaluateUnitStrength(...units: Unit[]): number
{
  let totalStrength = 0;

  units.forEach(unit =>
  {
    let unitStrength = 0;

    unitStrength += unit.currentHealth;
    // TODO ai

    totalStrength += unitStrength;
  });

  return totalStrength;
}
