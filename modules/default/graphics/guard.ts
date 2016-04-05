export namespace BattleSFXFunctions
{
  export function guard(props: Templates.SFXParams)
  {
    var userCanvasWidth = props.width * 0.4; // TODO BattleSFX
    var maxFrontier = userCanvasWidth;
    var baseTrailDistance = 80;
    var maxTrailDistance = maxFrontier;
    var trailDistanceGrowth = maxTrailDistance - baseTrailDistance;
    var maxBlockWidth = maxFrontier * 2;

    var uniforms =
    {
      frontier:
      {
        type: "1f",
        value: 0
      },
      trailDistance:
      {
        type: "1f",
        value: baseTrailDistance
      },
      seed:
      {
        type: "1f",
        value: Math.random() * 420
      },
      blockSize:
      {
        type: "1f",
        value: 90
      },
      blockWidth:
      {
        type: "1f",
        value: 0
      },
      lineAlpha:
      {
        type: "1f",
        value: 1.5
      },
      blockAlpha:
      {
        type: "1f",
        value: 0
      }
    }

    var travelTime = 0.2;
    var hasTriggeredEffect = false;

    var syncUniformsFN = function(time: number)
    {
      if (time < travelTime)
      {
        var adjustedtime = time / travelTime;
        uniforms.frontier.value = maxFrontier * adjustedtime;
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

        uniforms.trailDistance.value = baseTrailDistance + trailDistanceGrowth * adjustedtime;
        uniforms.blockWidth.value = adjustedtime * maxBlockWidth;
        uniforms.lineAlpha.value = (1 - adjustedtime) * 1.5;
        var relativeDistance = getRelativeValue(Math.abs(0.2 - adjustedtime), 0, 0.8);
        uniforms.blockAlpha.value = 1 - relativeDistance;
      }
    }

    var guardFilter = new GuardFilter(uniforms);
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
}
