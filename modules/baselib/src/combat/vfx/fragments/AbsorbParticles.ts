import { ParticleBurst, ParticleBurstProps } from "./ParticleBurst";


export class AbsorbParticles<D extends PIXI.DisplayObject> extends ParticleBurst<D>
{
  public override displayName = "AbsorbParticles";
  public override key = "absorbParticles";

  constructor(props: ParticleBurstProps<D>)
  {
    super(props);

    this.props.velocity *= -1;
    this.props.acceleration *= -1;
  }
}
