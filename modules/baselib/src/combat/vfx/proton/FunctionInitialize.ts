import * as Proton from "proton-js";
import { PixiParticle } from "./PixiParticle";


export class FunctionInitialize<T extends Proton.Particle = PixiParticle> extends Proton.Initialize
{
  public name: string;

  public override initialize: (target: T) => void;
  public override reset: () => void;

  constructor(name: string, initializeFN: (target: T) => void, resetFN?: () => void)
  {
    super();

    this.name = name;
    this.initialize = initializeFN;
    this.reset = resetFN;
  }
}
