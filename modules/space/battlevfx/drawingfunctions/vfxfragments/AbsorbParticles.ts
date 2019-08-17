import { ParticleBurst, ParticleBurstProps } from "./ParticleBurst";


export class AbsorbParticles<D extends PIXI.DisplayObject> extends ParticleBurst<D>
{
  public displayName = "AbsorbParticles";
  public key = "absorbParticles";

  constructor(props: ParticleBurstProps<D>)
  {
    super(props);

    this.props.velocity *= -1;
    this.props.acceleration *= -1;
  }
}
