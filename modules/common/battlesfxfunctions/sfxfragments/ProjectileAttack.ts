/// <reference path="../../../../lib/pixi.d.ts" />

import SFXFragment from "./SFXFragment";
import SFXFragmentPropTypes from "./SFXFragmentPropTypes";

import UnitDrawingFunctionData from "../../../../src/UnitDrawingFunctionData";
import Point from "../../../../src/Point";
import
{
  randInt
} from "../../../../src/utility";

type impactFN = (projectile: Projectile, container: PIXI.Container, time: number) => void;

interface PartialProjectileAttackProps
{
  projectileTextures?: PIXI.Texture[];

  onImpact?: impactFN;
  animateImpact?: impactFN;
  removeAfterImpact?: boolean;
  impactRate?: number;
  impactPosition?:
  {
    min: number;
    max: number;
  };

  maxSpeed?: number;
  acceleration?: number;

  amountToSpawn?: number;

  spawnTimeStart?: number;
  spawnTimeEnd?: number;
}
interface ProjectileAttackProps extends PartialProjectileAttackProps
{
  projectileTextures: PIXI.Texture[];

  onImpact?: impactFN;
  animateImpact?: impactFN;
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
const defaultProjectileAttackProps: ProjectileAttackProps =
{
  projectileTextures: [],

  onImpact: undefined,
  animateImpact: undefined,
  removeAfterImpact: true,
  impactRate: 0.75,

  maxSpeed: 3,
  acceleration: 0.05,

  amountToSpawn: 20,

  spawnTimeStart: 0,
  spawnTimeEnd: 500,
}
const ProjectileAttackPropTypes: SFXFragmentPropTypes =
{
  // projectileTextures: PIXI.Texture[],

  // onImpact: impactFN,
  // animateImpact?: impactFN,
  removeAfterImpact: "boolean",
  impactRate: "number",
  impactPosition: "range",

  maxSpeed: "number",
  acceleration: "number",

  amountToSpawn: "number",

  spawnTimeStart: "number",
  spawnTimeEnd: "number",
}

class Projectile
{
  private spawnTime: number;
  private spawnPositionX: number;
  private maxSpeed: number;
  private acceleration: number;

  private container: PIXI.Container;
  public sprite: PIXI.Sprite;

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
    onImpact?: impactFN;
    animateImpact?: impactFN;
    impactPosition?: number;
    removeAfterImpact?: boolean;
  })
  {
    this. id = props.id;

    this.container = props.container;
    this.sprite = props.sprite;

    this.spawnTime = props.spawnTime;
    this.maxSpeed = props.maxSpeed;
    this.acceleration = props.acceleration;
    this.spawnPositionX = props.spawnPositionX;

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

export default class ProjectileAttack extends SFXFragment<ProjectileAttackProps, PartialProjectileAttackProps>
{
  public displayName = "ProjectileAttack";
  public key = "projectileAttack";

  private projectiles: Projectile[];
  private container: PIXI.Container;

  constructor(props: ProjectileAttackProps)
  {
    super(ProjectileAttackPropTypes, defaultProjectileAttackProps, props);

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
    this.container.removeChildren()
    this.projectiles = [];
    
    const spawningDuration = this.props.spawnTimeEnd - this.props.spawnTimeStart;

    for (let i = 0; i < this.props.amountToSpawn; i++)
    {
      const texture = this.props.projectileTextures[i % this.props.projectileTextures.length];
      const sprite = new PIXI.Sprite(texture);

      const spawnPosition =
        userData.sequentialAttackOriginPoints[i % userData.sequentialAttackOriginPoints.length];
      sprite.position.y = spawnPosition.y;

      const targetBBox = targetData.boundingBox;

      this.projectiles.push(new Projectile(
      {
        id: i,

        container: this.container,
        sprite: sprite,

        spawnTime: this.props.spawnTimeStart + i * (spawningDuration / this.props.amountToSpawn),
        spawnPositionX: spawnPosition.x,
        maxSpeed: this.props.maxSpeed,
        acceleration: this.props.acceleration,

        onImpact: this.props.onImpact,
        animateImpact: this.props.animateImpact,
        impactPosition: randInt(this.props.impactPosition.min, this.props.impactPosition.max),
        removeAfterImpact: this.props.removeAfterImpact,
      }));
    }

    this.setDisplayObject(this.container);
  }
}
