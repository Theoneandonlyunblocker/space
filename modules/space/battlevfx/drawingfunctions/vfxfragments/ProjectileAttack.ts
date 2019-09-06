import * as PIXI from "pixi.js";

import {UnitDrawingFunctionData} from "core/unit/UnitDrawingFunctionData";
import
{
  randInt,
  getRelativeValue,
} from "core/generic/utility";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import {ProjectileWithImpact} from "./ProjectileWithImpact";
import { Projectile } from "./Projectile";


interface ProjectileAttackProps<ProjD extends PIXI.Sprite = PIXI.Sprite>
{
  makeProjectileSprite: (projectileNumber: number) => ProjD;
  animateProjectile?: (displayObject: ProjD, time: number, x: number, y: number) => void;

  onImpact?: (projectileIndex: number, x: number, y: number, time: number) => void;
  animateImpact?: (projectileIndex: number, time: number) => void;
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
  impactDuration?: number;
}

export class ProjectileAttack<ProjD extends PIXI.Sprite = PIXI.Sprite> extends VfxFragment<ProjectileAttackProps<ProjD>>
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
    impactDuration: new PropInfo.Number(0.2),
  };

  private projectiles: (Projectile<ProjD> | ProjectileWithImpact<ProjD>)[];
  private container: PIXI.Container;

  constructor(props: ProjectileAttackProps<ProjD>)
  {
    super();

    this.initializeProps(props);
    this.container = new PIXI.Container();
  }

  public animate(time: number): void
  {
    this.projectiles.forEach((projectile, i) =>
    {
      const relativeTime = this.getRelativeTimeForProjectileIndex(i, time);

      if (relativeTime < 0)
      {
        projectile.displayObject.visible = false;
      }
      else
      {
        projectile.displayObject.visible = true;
        projectile.animate(relativeTime);
      }
    });
  }
  public draw(userData: UnitDrawingFunctionData, targetData: UnitDrawingFunctionData): void
  {
    this.container.removeChildren();
    this.projectiles = [];

    for (let i = 0; i < this.props.amountToSpawn; i++)
    {
      const spawnPosition = this.props.useSequentialAttackOriginPoints ?
        userData.sequentialAttackOriginPoints[i % userData.sequentialAttackOriginPoints.length] :
        userData.singleAttackOriginPoint;

      const willImpact = Math.random() < this.props.impactRate;

      const makeProjectile = () =>
      {
        return new Projectile(
        {
          getDisplayObject: () => this.props.makeProjectileSprite(i),
          spawnPosition: spawnPosition,
          animateProjectile: this.props.animateProjectile,

          terminalVelocity: this.props.maxSpeed,
          acceleration: this.props.acceleration,
        });
      };

      if (!willImpact)
      {
        this.projectiles.push(makeProjectile());
      }
      else
      {
        this.projectiles.push(new ProjectileWithImpact(
        {
          impactPosition: randInt(this.props.impactPosition.min, this.props.impactPosition.max),
          removeAfterImpact: this.props.removeAfterImpact,
          getProjectileFragment: makeProjectile,
          onImpact: this.props.onImpact.bind(null, i),
          animateImpact: this.props.animateImpact.bind(null, i),
          impactDuration: this.props.impactDuration,
        }));
      }

      this.projectiles[i].draw();
      this.container.addChild(this.projectiles[i].displayObject);
    }

    this.setDisplayObject(this.container);
  }

  private getRelativeTimeForProjectileIndex(i: number, time: number): number
  {
    const spawningDuration = this.props.spawnTimeEnd - this.props.spawnTimeStart;
    const delayBetweenSpawns = spawningDuration / this.props.amountToSpawn;

    const startTime = this.props.spawnTimeStart + i * delayBetweenSpawns;
    const endTime = startTime + 1;

    const relativeTime = getRelativeValue(time, startTime, endTime);

    return relativeTime;
  }
}
