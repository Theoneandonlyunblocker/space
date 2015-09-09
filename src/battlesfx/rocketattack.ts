module Rance
{
  export module BattleSFX
  {
    export function rocketAttack(props: Templates.SFXParams)
    {
      var travelSpeed = props.width / props.duration * 2; //milliseconds
      var acceleration = travelSpeed / 10;
      var maxSpeed = travelSpeed * 1.3;
      if (!props.facingRight)
      {
        travelSpeed = -travelSpeed;
      }
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

      var rockets:
      {
        sprite: PIXI.Sprite;
        speed: number;
      }[] = []

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

          rockets.push(
          {
            sprite: sprite,
            speed: 0
          });
        }

        for (var i = 0; i < rockets.length; i++)
        {
          var rocket = rockets[i];
          if (rocket.speed < maxSpeed)
          {
            rocket.speed += acceleration;
          }
          rocket.sprite.x += rocket.speed * elapsedTime;
        }

        renderer.render(container);

        if (currentTime < endTime)
        {
          requestAnimationFrame(animate)
        }
      }

      props.onLoaded(renderer.view);

      animate();

      return renderer.view;
    }
  }
}