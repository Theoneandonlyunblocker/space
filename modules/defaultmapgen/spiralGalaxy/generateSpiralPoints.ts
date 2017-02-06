import MapGenPoint from "../common/MapGenPoint";

import SpiralGalaxyOptionValues from "./SpiralGalaxyOptionValues";

import
{
  randRange,
} from "../../../src/utility";


export default function generateSpiralPoints(options: SpiralGalaxyOptionValues): MapGenPoint[]
{
  const sg = convertMapGenOptionValues(options);

  const makePoint = function(
    distanceMin: number,
    distanceMax: number,
    arm: number,
    maxOffset: number,
  ): MapGenPoint
  {
    const distance = randRange(distanceMin, distanceMax);
    let offset = Math.random() * maxOffset - maxOffset / 2;
    offset *= (1 / distance);

    if (offset < 0)
    {
      offset = Math.pow(offset, 2) * -1;
    }
    else
    {
      offset = Math.pow(offset, 2);
    }

    const armRotation = distance * sg.armRotationFactor;
    const angle = arm * sg.armDistance + sg.galaxyRotation + offset + armRotation;

    const width = options.defaultOptions.width / 2;
    const height = options.defaultOptions.height / 2;

    const x = Math.cos(angle) * distance * width + width;
    const y = Math.sin(angle) * distance * height + height;

    const point = new MapGenPoint(x, y);

    point.mapGenData.mapGenDistance = distance;

    return point;
  };

  const points: MapGenPoint[] = [];

  for (let i = 0; i < sg.totalArms; i++)
  {
    const currentArmIsFiller = i % 2 !== 0;

    const amountForThisArm = currentArmIsFiller ? sg.amountPerFillerArm : sg.amountPerArm;
    const shouldMakeUpDeficitForThisArm = sg.armsToMakeUpDeficit.indexOf(i) !== -1;
    const amountForThisCenter = sg.amountPerCenter +
      (shouldMakeUpDeficitForThisArm ? sg.starsToAddPerDeficitArm : 0);

    const maxOffsetForThisArm = currentArmIsFiller ? sg.armOffsetMax / 2 : sg.armOffsetMax;

    for (let j = 0; j < amountForThisArm; j++)
    {
      const point = makePoint(sg.centerSize, 1, i, maxOffsetForThisArm);
      points.push(point);
      point.mapGenData.tags = ["arm_" + i];
      point.mapGenData.isFiller = currentArmIsFiller;
    }
    for (let j = 0; j < amountForThisCenter; j++)
    {
      const point = makePoint(0, sg.centerSize, i, maxOffsetForThisArm);
      points.push(point);
      point.mapGenData.tags = ["center"];
      // if (!currentArmIsFiller)
      // {
      //   point.mapGenData.tags.push("arm_" + i);
      // }
      point.mapGenData.isFiller = false;
    }
  }

  return points;
}

function convertMapGenOptionValues(options: SpiralGalaxyOptionValues)
{
  const totalStars = options.defaultOptions.starCount;

  const actualArms = options.basicOptions.arms;
  const totalArms = actualArms * 2; // includes filler arms

  const percentageInCenter = 0.3;
  const percentageInArms = 1 - percentageInCenter;
  const amountInCenter = totalStars * percentageInCenter;
  const amountPerArm = Math.round(totalStars / actualArms * percentageInArms);
  const amountPerFillerArm = Math.round(amountPerArm / 2);
  const amountPerCenter = Math.round(amountInCenter / totalArms);

  // to prevent rounding issues, probably a better way to do this
  const actualStarsInArms = actualArms * amountPerArm;
  const actualStarsInCenter = totalArms * amountPerCenter;
  const actualStars = actualStarsInCenter + actualStarsInArms;
  const starsDeficit = totalStars - actualStars;
  const armsToMakeUpDeficit: number[] = [];

  let starsToAddPerDeficitArm = 0;

  if (starsDeficit !== 0)
  {
    starsToAddPerDeficitArm = starsDeficit > 0 ? 1 : -1;
    const deficitStep = totalArms / Math.abs(starsDeficit);

    for (let i = 0; i < totalArms; i += deficitStep)
    {
      armsToMakeUpDeficit.push(Math.round(i));
    }
  }

  return(
  {
    totalArms: totalArms,
    armsToMakeUpDeficit: armsToMakeUpDeficit,
    starsToAddPerDeficitArm: starsToAddPerDeficitArm,

    amountPerArm: amountPerArm,
    amountPerFillerArm: amountPerFillerArm,
    amountPerCenter: amountPerCenter,
    centerSize: 0.4,

    armDistance: Math.PI * 2 / totalArms, // distance between arms
    armOffsetMax: 0.5, // how far stars are allowed to move from arm center
    armRotationFactor: actualArms / 3, // how twisty the arms are. bigger number = twistier
    galaxyRotation: randRange(0, Math.PI * 2), // rotation of entire galaxy
  });
}
