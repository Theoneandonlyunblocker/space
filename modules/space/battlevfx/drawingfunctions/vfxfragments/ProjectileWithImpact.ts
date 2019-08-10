import * as PIXI from "pixi.js";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import {Projectile} from "./Projectile";
import { getRelativeValue } from "../../../../../src/utility";


interface ProjectileWithImpactProps<D extends PIXI.DisplayObject>
{
  impactPosition: number;
  removeAfterImpact: boolean;
  getProjectileFragment: () => Projectile<D>;
  drawImpact?: (x: number, y: number) => PIXI.DisplayObject;
  onImpact?: (x: number, y: number, time: number) => void;
  animateImpact: (time: number) => void;
  impactDuration: number;
}

export class ProjectileWithImpact<D extends PIXI.DisplayObject> extends VfxFragment<ProjectileWithImpactProps<D>>
{
  public displayName = "ProjectileWithImpact";
  public key = "projectileWithImpact";

  public readonly propInfo =
  {
    impactPosition: new PropInfo.Number(500),
    removeAfterImpact: new PropInfo.Boolean(true),
    getProjectileFragment: new PropInfo.Function(() =>
    {
      return new Projectile(
      {
        getDisplayObject: () => <D><any>PIXI.Sprite.from("placeHolder"),
        spawnPosition: {x: 0, y: 0},
        initialVelocity: 800,
      });
    }),
    drawImpact: new PropInfo.Function(undefined),
    onImpact: new PropInfo.Function(undefined),
    animateImpact: new PropInfo.Function((time: number) => {}),
    impactDuration: new PropInfo.Number(0.2),
  };

  private readonly container: PIXI.Container;
  private projectileFragment: Projectile<D>;
  private projectileImpactTime: number;
  private impactDisplayObject: PIXI.DisplayObject | undefined;
  private hasTriggeredOnImpact: boolean = false;

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
      if (this.props.removeAfterImpact)
      {
        this.projectileFragment.displayObject.visible = false;
      }
      else
      {
        this.projectileFragment.animate(time);
      }

      if (this.impactDisplayObject)
      {
        this.impactDisplayObject.visible = true;
      }
      if (!this.hasTriggeredOnImpact)
      {
        this.hasTriggeredOnImpact = true;
        if (this.props.onImpact)
        {
          this.props.onImpact(this.props.impactPosition, this.projectileFragment.props.spawnPosition.y, time);
        }
      }

      this.props.animateImpact(getRelativeValue(time, this.projectileImpactTime, this.projectileImpactTime + this.props.impactDuration));
    }
    else
    {
      this.projectileFragment.displayObject.visible = true;
      if (this.impactDisplayObject)
      {
        this.impactDisplayObject.visible = false;
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

    if (this.props.drawImpact)
    {
      this.impactDisplayObject = this.props.drawImpact(
        this.props.impactPosition,
        this.projectileFragment.props.spawnPosition.y,
      );
      this.container.addChild(this.impactDisplayObject);
    }

    this.setDisplayObject(this.container);
  }
}
