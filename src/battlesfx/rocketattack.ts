module Rance
{
  export module BattleSFX
  {
    export function rocketAttack(props: Templates.SFXParams)
    {
      var travelSpeed = props.width / props.duration * 3; //milliseconds
      var acceleration = travelSpeed / 20;
      var maxSpeed = travelSpeed;
      if (!props.facingRight)
      {
        travelSpeed = -travelSpeed;
      }
      var renderer = PIXI.autoDetectRenderer(props.width, props.height,
      {
        transparent: true
      });
      
      var container = new PIXI.Container();

      var rocketTexture = PIXI.Texture.fromFrame("img\/battleEffects\/rocket.png");
      var explosionTextures: PIXI.Texture[] = [];

      for (var i = 0; i < 26; i++)
      {
         var explosionTexture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i+1) + '.png');
         explosionTextures.push(explosionTexture);
      }

      var startTime = Date.now();
      var endTime = startTime + props.duration;
      var stopSpawningTime = startTime + props.duration / 2;
      var lastTime = startTime;

      var rocketsToSpawn = 20;
      var explosionsToSpawn = 4;
      var explosionRate = rocketsToSpawn / explosionsToSpawn;
      var spawnRate = (stopSpawningTime - startTime) / rocketsToSpawn;
      var nextSpawnTime = startTime;

      var rockets:
      {
        sprite: PIXI.Sprite;
        speed: number;
        explosionX: number;
        willExplode: boolean;
        hasExplosion: boolean;
      }[] = []

      function animate()
      {
        var currentTime = Date.now();
        var elapsedTime = currentTime - lastTime;
        lastTime = Date.now();

        if (currentTime < stopSpawningTime && currentTime >= nextSpawnTime)
        {
          nextSpawnTime += spawnRate;
          var sprite = new PIXI.Sprite(rocketTexture);
          sprite.x = 20;
          sprite.y = randInt(props.height - 200, props.height - 50);
          container.addChild(sprite);

          rockets.push(
          {
            sprite: sprite,
            speed: 0,
            willExplode: (rockets.length - 1) % explosionRate === 0,
            explosionX: randInt(props.width - 200, props.width - 50),
            hasExplosion: false
          });
        }

        for (var i = 0; i < rockets.length; i++)
        {
          var rocket = rockets[i];
          if (!rocket.hasExplosion)
          {
            if (rocket.speed < maxSpeed)
            {
              rocket.speed += acceleration;
            }
            rocket.sprite.x += rocket.speed * elapsedTime;
          }

          if (!rocket.hasExplosion && rocket.willExplode && rocket.sprite.x >= rocket.explosionX)
          {
            console.log("explode");
            rocket.hasExplosion = true;
            var explosion = new PIXI.extras.MovieClip(explosionTextures);
            explosion.anchor = new PIXI.Point(0.5, 0.5);
            explosion.loop = false;
            explosion.position = rocket.sprite.position;
            container.removeChild(rocket.sprite);
            container.addChild(explosion);
            explosion.play();
          }
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