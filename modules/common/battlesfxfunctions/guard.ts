import SFXParams from "../../../src/templateinterfaces/SFXParams";
import GuardFilter from "./shaders/Guard";

import
{
  getRelativeValue
} from "../../../src/utility";

export default function guard(props: SFXParams)
{
  var userCanvasWidth = props.width * 0.4; // TODO BattleSFX
  var maxFrontier = userCanvasWidth;
  var baseTrailDistance = 80;
  var maxTrailDistance = maxFrontier;
  var trailDistanceGrowth = maxTrailDistance - baseTrailDistance;
  var maxBlockWidth = maxFrontier * 2;

  var guardFilter = new GuardFilter(
  {
    frontier: 0,
    trailDistance: baseTrailDistance,
    seed: Math.random() * 420,
    blockSize: 90,
    blockWidth: 0,
    lineAlpha: 1.5,
    blockAlpha: 0
  });

  var travelTime = 0.2;
  var hasTriggeredEffect = false;

  var syncUniformsFN = function(time: number)
  {
    if (time < travelTime)
    {
      var adjustedtime = time / travelTime;
      guardFilter.setUniformValues(
      {
        frontier: maxFrontier * adjustedtime
      });
    }
    else
    {
      if (props.triggerEffect && !hasTriggeredEffect)
      {
        hasTriggeredEffect = true;
        props.triggerEffect();
      }
      var adjustedtime = getRelativeValue(time, travelTime - 0.02, 1);
      adjustedtime = Math.pow(adjustedtime, 4);
      var relativeDistance = getRelativeValue(Math.abs(0.2 - adjustedtime), 0, 0.8);

      guardFilter.setUniformValues(
      {
        trailDistance: baseTrailDistance + trailDistanceGrowth * adjustedtime,
        blockWidth: adjustedtime * maxBlockWidth,
        lineAlpha: (1 - adjustedtime) * 1.5,
        blockAlpha: 1 - relativeDistance
      });
    }
  }

  var container = new PIXI.Container();

  container.filters = [guardFilter];
  container.filterArea = new PIXI.Rectangle(0, 0, maxFrontier + 20, props.height);

  var renderTexture = new PIXI.RenderTexture(props.renderer, props.width, props.height);
  var sprite = new PIXI.Sprite(renderTexture);
  if (!props.facingRight)
  {
    sprite.x = props.width;
    sprite.scale.x = -1;
  }

  function animate()
  {
    var elapsedTime = Date.now() - startTime;
    var relativeTime = elapsedTime / props.duration;
    syncUniformsFN(relativeTime);

    renderTexture.clear();
    renderTexture.render(container);

    if (elapsedTime < props.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      props.triggerEnd();
    }
  }

  props.triggerStart(sprite);

  var startTime = Date.now();
  animate();
}
