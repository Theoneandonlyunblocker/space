import * as PIXI from "pixi.js";

import {UnitDrawingFunctionData} from "../../../../../src/UnitDrawingFunctionData";
import
{
  randInt,
} from "../../../../../src/utility";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";


type impactFN = (projectile: Projectile, container: PIXI.Container, time: number) => void;
type makeProjectileSpriteFN = (projectileNumber: number) => PIXI.Sprite;
type animateProjectileFN = (projectile: Projectile, time: number) => void;

interface ProjectileAttackProps
{
  makeProjectileSprite: makeProjectileSpriteFN;
  animateProjectile?: animateProjectileFN;

  onImpact?: impactFN;
  animateImpact?: impactFN;
  useSequentialAttackOriginPoints?: boolean;
  removeAfterImpact?: boolean;
  impactRate?: number;
  impactPosition?:
  {
    min: number;
    max: number;
  };

  maxSpeed: number;
  acceleration: number;

  amountToSpawn: number;

  spawnTimeStart: number;
  spawnTimeEnd: number;
}

class Projectile
{
  private spawnTime: number;
  private spawnPositionX: number;
  private maxSpeed: number;
  private acceleration: number;

  private container: PIXI.Container;
  public sprite: PIXI.Sprite;

  private animateProjectile: animateProjectileFN | undefined;
  private onImpact: impactFN | undefined;
  private animateImpact: impactFN | undefined;
  private impactPosition: number | undefined;
  private hasImpacted: boolean = false;
  private willImpact: boolean;
  private removeAfterImpact: boolean;

  public id: number;

  constructor(props:
  {
    id: number;

    container: PIXI.Container;
    sprite: PIXI.Sprite;
    spawnTime: number;
    maxSpeed: number;
    acceleration: number;
    spawnPositionX: number;
    animateProjectile?: animateProjectileFN;
    onImpact?: impactFN;
    animateImpact?: impactFN;
    impactPosition?: number;
    removeAfterImpact?: boolean;
  })
  {
    this.id = props.id;

    this.container = props.container;
    this.sprite = props.sprite;

    this.spawnTime = props.spawnTime;
    this.maxSpeed = props.maxSpeed;
    this.acceleration = props.acceleration;
    this.spawnPositionX = props.spawnPositionX;

    this.animateProjectile = props.animateProjectile;
    this.onImpact = props.onImpact;
    this.animateImpact = props.animateImpact;
    this.impactPosition = props.impactPosition;
    this.removeAfterImpact = props.removeAfterImpact;

    this.willImpact = isFinite(this.impactPosition);

    this.container.addChild(this.sprite);
    this.sprite.visible = false;
  }

  public draw(time: number): void
  {
    const position = this.getPosition(time);
    const tipPosition = position + this.sprite.width;

    const hasReachedImpactPosition = this.willImpact &&
      tipPosition >= this.impactPosition;

    if (hasReachedImpactPosition)
    {
      if (!this.hasImpacted)
      {
        this.hasImpacted = true;
        if (this.onImpact)
        {
          this.onImpact(this, this.container, time);
        }
      }

      if (this.animateImpact)
      {
        this.animateImpact(this, this.container, time);
      }
    }

    const shouldDraw = time >= this.spawnTime &&
      (!this.hasImpacted || !this.removeAfterImpact);

    if (!shouldDraw)
    {
      this.sprite.visible = false;
    }
    else
    {
      this.sprite.visible = true;
      this.sprite.position.x = position;
      if (this.animateProjectile)
      {
        this.animateProjectile(this, time);
      }
    }
  }
  private getPosition(relativeTime: number): number
  {
    const time = relativeTime - this.spawnTime;

    if (time < 0)
    {
      return undefined;
    }

    const timeForMaxSpeed = this.spawnTime + this.maxSpeed / this.acceleration;

    const timeAccelerated = Math.min(time, timeForMaxSpeed);
    const positionBeforeMaxSpeed = this.spawnPositionX +
      0.5 * this.acceleration * Math.pow(timeAccelerated, 2.0);

    if (time <= timeForMaxSpeed)
    {
      return positionBeforeMaxSpeed;
    }
    else
    {
      const timeAfterReachingMaxSpeed = time - timeForMaxSpeed;

      return positionBeforeMaxSpeed + timeAfterReachingMaxSpeed * this.maxSpeed;
    }
  }
}

export class ProjectileAttack extends VfxFragment<ProjectileAttackProps>
{
  public displayName = "ProjectileAttack";
  public key = "projectileAttack";

  public readonly propInfo =
  {
    makeProjectileSprite: new PropInfo.Function(undefined),
    animateProjectile: new PropInfo.Function(undefined),

    onImpact: new PropInfo.Function(undefined),
    animateImpact: new PropInfo.Function(undefined),
    useSequentialAttackOriginPoints: new PropInfo.Boolean(true),
    removeAfterImpact: new PropInfo.Boolean(true),
    impactRate: new PropInfo.Number(0.75),
    impactPosition: new PropInfo.Range({min: 0.7, max: 1.0}),

    maxSpeed: new PropInfo.Number(3),
    acceleration: new PropInfo.Number(0.05),

    amountToSpawn: new PropInfo.Number(20),

    spawnTimeStart: new PropInfo.Number(0),
    spawnTimeEnd: new PropInfo.Number(500),
  };

  private projectiles: Projectile[];
  private container: PIXI.Container;

  constructor(props: ProjectileAttackProps)
  {
    super();

    this.initializeProps(props);
    this.container = new PIXI.Container();
  }

  public animate(time: number): void
  {
    this.projectiles.forEach(projectile =>
    {
      projectile.draw(time);
    });
  }
  public draw(userData: UnitDrawingFunctionData, targetData: UnitDrawingFunctionData): void
  {
    this.container.removeChildren();
    this.projectiles = [];

    const spawningDuration = this.props.spawnTimeEnd - this.props.spawnTimeStart;

    for (let i = 0; i < this.props.amountToSpawn; i++)
    {
      const sprite = this.props.makeProjectileSprite(i);

      const spawnPosition = this.props.useSequentialAttackOriginPoints ?
        userData.sequentialAttackOriginPoints[i % userData.sequentialAttackOriginPoints.length] :
        userData.singleAttackOriginPoint;
      sprite.position.y = spawnPosition.y;
      sprite.anchor.set(0, 0.5);

      this.projectiles.push(new Projectile(
      {
        id: i,

        container: this.container,
        sprite: sprite,

        spawnTime: this.props.spawnTimeStart + i * (spawningDuration / this.props.amountToSpawn),
        spawnPositionX: spawnPosition.x,
        maxSpeed: this.props.maxSpeed,
        acceleration: this.props.acceleration,

        animateProjectile: this.props.animateProjectile,
        onImpact: this.props.onImpact,
        animateImpact: this.props.animateImpact,
        impactPosition: randInt(this.props.impactPosition.min, this.props.impactPosition.max),
        removeAfterImpact: this.props.removeAfterImpact,
      }));
    }

    this.setDisplayObject(this.container);
  }
}
