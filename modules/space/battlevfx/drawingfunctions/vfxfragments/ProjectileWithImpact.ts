import * as PIXI from "pixi.js";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import {Projectile} from "./Projectile";
import { getRelativeValue } from "../../../../../src/utility";


interface ProjectileWithImpactProps<D extends PIXI.DisplayObject>
{
  impactPosition: number;
  getProjectileFragment: () => Projectile<D>;
  drawExplosion?: (x: number, y: number) => PIXI.DisplayObject;
  animateExplosion: (time: number) => void;
}

export class ProjectileWithImpact<D extends PIXI.DisplayObject> extends VfxFragment<ProjectileWithImpactProps<D>>
{
  public displayName = "ProjectileWithImpact";
  public key = "projectileWithImpact";

  public readonly propInfo =
  {
    impactPosition: new PropInfo.Number(500),
    getProjectileFragment: new PropInfo.Function(() =>
    {
      return new Projectile(
      {
        getDisplayObject: () => <D><any>PIXI.Sprite.from("placeHolder"),
        spawnPosition: {x: 0, y: 0},
        initialVelocity: 800,
      });
    }),
    drawExplosion: new PropInfo.Function(undefined),
    animateExplosion: new PropInfo.Function((time: number) => {}),
  };

  private projectileFragment: Projectile<D>;
  private container: PIXI.Container;
  private projectileImpactTime: number;
  private explosion: PIXI.DisplayObject | undefined;

  constructor(props: ProjectileWithImpactProps<D>)
  {
    super();

    this.initializeProps(props);
    this.container = new PIXI.Container();
  }

  public animate(time: number): void
  {
    this.projectileFragment.animate(time);

    const hasImpacted = time >= this.projectileImpactTime;

    if (hasImpacted)
    {
      this.projectileFragment.displayObject.visible = false;
      if (this.explosion)
      {
        this.explosion.visible = true;
      }

      this.props.animateExplosion(getRelativeValue(time, this.projectileImpactTime, 1));
    }
    else
    {
      this.projectileFragment.displayObject.visible = true;
      if (this.explosion)
      {
        this.explosion.visible = false;
      }

      this.projectileFragment.animate(time);
    }
  }
  public draw(): void
  {
    this.projectileFragment = this.props.getProjectileFragment();
    this.projectileFragment.draw();
    this.container.addChild(this.projectileFragment.displayObject);

    const projectilePositionForImpact = this.props.impactPosition - this.projectileFragment.bounds.width;
    this.projectileImpactTime = this.projectileFragment.getTimeForPosition(projectilePositionForImpact, 0.001);

    if (this.props.drawExplosion)
    {
      this.explosion = this.props.drawExplosion(
        this.props.impactPosition,
        this.projectileFragment.props.spawnPosition.y,
      );
      this.container.addChild(this.explosion);
    }

    this.setDisplayObject(this.container);
  }
}
