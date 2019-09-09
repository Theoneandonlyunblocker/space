export const battleVfxAssetsToLoad =
{
  snipeProjectile: "./assets/battleVfx/img/ellipse.png",
  rope: "./assets/battleVfx/img/rope.png",
  harpoon: "./assets/battleVfx/img/harpoon.png",
  rocketProjectile: "./assets/battleVfx/img/rocket.png",
  rocketExplosion: "./assets/battleVfx/img/explosion.json",
};

export const battleVfxAssets: {[K in keyof typeof battleVfxAssetsToLoad]?: K} =
{
  snipeProjectile: "snipeProjectile",
  rocketProjectile: "rocketProjectile",
  rope: "rope",
  harpoon: "harpoon",
};
