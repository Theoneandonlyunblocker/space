export namespace BattleSFXFunctions
{
  export function makeSFXFromVideo(videoSrc: string, onStartFN: (sprite: PIXI.Sprite) => void,
    props: Templates.SFXParams)
  {
    function clearBaseTextureListeners()
    {
      baseTexture.removeListener("loaded", onVideoLoaded);
      baseTexture.removeListener("error", onVideoError);
    }
    function onVideoLoaded()
    {
      clearBaseTextureListeners();

      baseTexture.autoUpdate = false;

      if (onStartFN)
      {
        onStartFN(sprite);
      }

      startTime = Date.now();
      props.triggerStart(sprite);
      animate();
    }
    function onVideoError()
    {
      clearBaseTextureListeners();

      throw new Error("Video " + videoSrc + " failed to load.");
    }

    var baseTexture = PIXI.VideoBaseTexture.fromUrl(videoSrc);
    var texture = new PIXI.Texture(baseTexture);
    var sprite = new PIXI.Sprite(texture);

    if (!props.facingRight)
    {
      sprite.x = props.width;
      sprite.scale.x = -1;
    }

    if (baseTexture.hasLoaded)
    {
      onVideoLoaded();
    }
    else if (baseTexture.isLoading)
    {
      baseTexture.on("loaded", onVideoLoaded);
      baseTexture.on("error", onVideoError);
    }
    else
    {
      onVideoError();
    }

    var startTime: number;

    function animate()
    {
      var elapsedTime = Date.now() - startTime;

      baseTexture.update();

      if (elapsedTime < props.duration && !baseTexture.source.paused)
      {
        requestAnimationFrame(animate);
      }
      else
      {
        props.triggerEnd();
        sprite.destroy(true, true);
      }
      
    }
  }
}
