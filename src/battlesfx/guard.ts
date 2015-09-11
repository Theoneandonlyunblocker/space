module Rance
{
  export module BattleSFX
  {
    export function guard(props: Templates.SFXParams)
    {
      var userCanvasWidth = props.user.cachedBattleScene.width;
      var maxFrontier = Math.max(userCanvasWidth * 1.3, 300);
      var baseTrailDistance = 80;
      var maxTrailDistance = maxFrontier / 2;
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
          value: Math.random()
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

      var syncUniformsFN = function(time: number)
      {
        if (time < 0.25)
        {
          var adjustedtime = time / 0.25;
          uniforms.frontier.value = maxFrontier * adjustedtime;
        }
        else
        {
          var adjustedtime = getRelativeValue(time, 0.2, 1);
          var quadraticTime = Math.pow(adjustedtime, 4);

          uniforms.trailDistance.value = baseTrailDistance + trailDistanceGrowth * quadraticTime;
          uniforms.blockWidth.value = quadraticTime * maxBlockWidth;
          uniforms.lineAlpha.value = (1 - quadraticTime) * 1.5;
          uniforms.blockAlpha.value = 1 - quadraticTime;
        }
      }

      var guardFilter = new GuardFilter(uniforms);

      var renderer = PIXI.autoDetectRenderer(props.width, props.height,
      {
        transparent: true
      });

      var container = new PIXI.Container();
      if (!props.facingRight)
      {
        container.scale.x = -1;
        container.x = props.width;
      }

      container.filters = [guardFilter];
      container.filterArea = new PIXI.Rectangle(0, 0, maxFrontier + 20, props.height);

      function animate()
      {
        var elapsedTime = Date.now() - startTime;
        var relativeTime = elapsedTime / props.duration;
        syncUniformsFN(relativeTime);

        renderer.render(container);

        if (elapsedTime < props.duration)
        {
          requestAnimationFrame(animate);
        }
      }

      props.onLoaded(renderer.view);

      var startTime = Date.now();
      animate();

      return renderer.view;
    }
  }
}
