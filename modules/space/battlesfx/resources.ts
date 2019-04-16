export const toLoad =
{
  snipeProjectile: "./img/ellipse.png",
  rocketProjectile: "./img/rocket.png",
  rocketExplosion: "./img/explosion.json",
};

export const resources: {[K in keyof typeof toLoad]?: K} =
{
  snipeProjectile: "snipeProjectile",
  rocketProjectile: "rocketProjectile",
};
