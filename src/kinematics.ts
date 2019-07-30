export function solveAcceleration(p:
{
  initialVelocity: number,
  duration: number,
  displacement: number,
}): number
{
  return (p.displacement - p.initialVelocity * p.duration) / (0.5 * Math.pow(p.duration, 2));
}
