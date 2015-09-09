module Rance
{
  export module BattleSFX
  {
    export function rocketAttack(props: Templates.SFXParams)
    {
      var travelSpeed = props.width / props.duration * 2; //milliseconds
      if (!props.facingRight)
      {
        travelSpeed = -travelSpeed;
      }
      console.log(props.width, props.height);
      var renderer = PIXI.autoDetectRenderer(props.width, props.height,
      {
        transparent: true
      });
      
      var container = new PIXI.Container();

      var texture = PIXI.Texture.fromFrame("img\/battleEffects\/rocketAttack.png");
      var startTime = Date.now();
      var endTime = startTime + props.duration;
      var stopSpawningTime = startTime + props.duration / 2;
      var lastTime = startTime;

      var rocketsToSpawn = 20;
      var spawnRate = (stopSpawningTime - startTime) / rocketsToSpawn;
      var nextSpawnTime = startTime;

      function animate()
      {
        var currentTime = Date.now();
        var elapsedTime = currentTime - lastTime;
        lastTime = Date.now();

        if (currentTime < stopSpawningTime && currentTime >= nextSpawnTime)
        {
          console.log("spawn");
          nextSpawnTime += spawnRate;
          var sprite = new PIXI.Sprite(texture);
          sprite.x = 20;
          sprite.y = randInt(0, props.height);
          container.addChild(sprite);
        }

        for (var i = 0; i < container.children.length; i++)
        {
          container.children[i].x += travelSpeed * elapsedTime;
        }

        renderer.render(container);

        if (currentTime < endTime)
        {
          requestAnimationFrame(animate)
        }
      }

      animate();

      return renderer.view;
    }
  }
}