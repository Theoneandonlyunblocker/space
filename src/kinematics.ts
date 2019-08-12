export function solveAcceleration(p:
{
  initialVelocity: number;
  duration: number;
  displacement: number;
}): number
{
  return (p.displacement - p.initialVelocity * p.duration) / (0.5 * Math.pow(p.duration, 2));
}
export function solveInitialVelocity(p:
{
  duration: number;
  displacement: number;
  acceleration: number;
}): number
{
  return (p.displacement - 0.5 * p.acceleration * Math.pow(p.duration, 2)) / p.duration;
}
