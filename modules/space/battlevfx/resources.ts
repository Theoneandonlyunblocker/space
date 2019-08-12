export const toLoad =
{
  snipeProjectile: "./img/ellipse.png",
  rope: "./img/rope.png",
  rocketProjectile: "./img/rocket.png",
  rocketExplosion: "./img/explosion.json",
};

export const resources: {[K in keyof typeof toLoad]?: K} =
{
  snipeProjectile: "snipeProjectile",
  rocketProjectile: "rocketProjectile",
  rope: "rope",
};
