import * as PIXI from "pixi.js";

import SfxParams from "../../../../src/templateinterfaces/SfxParams";


export default function makeSfxFromVideo(
  videoSrc: string,
  onStartFN: (sprite: PIXI.Sprite) => void,
  props: SfxParams,
)
{
  function clearBaseTextureListeners()
  {
    baseTexture.removeListener("loaded", onVideoLoaded);
    baseTexture.removeListener("error", onVideoError);
  }
  function onVideoLoaded()
  {
    clearBaseTextureListeners();

    sprite.y = props.height - videoResource.height;

    if (onStartFN)
    {
      onStartFN(sprite);
    }

    props.triggerStart(sprite);
    animate();
  }
  function onVideoError(): void
  {
    clearBaseTextureListeners();

    throw new Error("Video " + videoSrc + " failed to load.");
  }

  const videoResource = new PIXI.resources.VideoResource(videoSrc);
  videoResource.autoUpdate = false;

  const baseTexture = new PIXI.BaseTexture(videoResource);
  const texture = new PIXI.Texture(baseTexture);
  const sprite = new PIXI.Sprite(texture);

  if (!props.facingRight)
  {
    sprite.x = props.width;
    sprite.scale.x = -1;
  }

  if (videoResource.valid)
  {
    onVideoLoaded();
  }
  else
  {
    baseTexture.on("loaded", onVideoLoaded);
    baseTexture.on("error", onVideoError);
  }
  // TODO 2019.07.03 | pixi5
  // else if (baseTexture.isLoading)
  // {
  //   baseTexture.on("loaded", onVideoLoaded);
  //   baseTexture.on("error", onVideoError);
  // }
  // else
  // {
  //   onVideoError();
  // }


  function animate()
  {
    videoResource.update();
    if (!videoResource.source.paused && !videoResource.source.ended)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      props.triggerEnd();
      sprite.parent.removeChild(sprite);
      sprite.destroy({texture: true, baseTexture: true});
    }
  }
}
