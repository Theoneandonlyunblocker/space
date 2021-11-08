import * as Proton from "proton-js";
import { PixiParticle } from "./PixiParticle";


export class FunctionBehaviour<T extends Proton.Particle = PixiParticle> extends Proton.Behaviour<T>
{
  public name: string;

  public applyBehaviour: (particle: T, time?: number, particleIndex?: number) => void;
  public override initialize: (target: T) => void;

  constructor(
    name: string,
    applyBehaviourFN: (particle: T, time?: number, particleIndex?: number) => void,
    initializeFN?: (target: T) => void,
  )
  {
    super();

    this.name = name;
    this.applyBehaviour = applyBehaviourFN;
    this.initialize = initializeFN || this.initialize;
  }
}
