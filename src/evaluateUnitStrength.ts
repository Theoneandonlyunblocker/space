import Unit from "./Unit";

// TODO 11.10.2016 | should be moved to modules
export default function evaluateUnitStrength(...units: Unit[]): number
{
  let totalStrength = 0;

  units.forEach((unit) =>
  {
    let unitStrength = 0;

    unitStrength += unit.currentHealth;
    // TODO ai

    totalStrength += unitStrength;
  });

  return totalStrength;
}
