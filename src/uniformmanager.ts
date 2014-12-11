module Rance
{
  export class UniformManager
  {
    registeredObjects:
    {
      [uniformType: string]: any[];
    } = {};

    timeCount: number = 0;

    constructor()
    {
    }

    registerObject(uniformType: string, shader: any)
    {
      if (!this.registeredObjects[uniformType])
      {
        this.registeredObjects[uniformType] = [];
      }

      this.registeredObjects[uniformType].push(shader);
    }

    updateTime()
    {
      this.timeCount += 0.01;

      if (!this.registeredObjects["time"]) return;

      for (var i = 0; i < this.registeredObjects["time"].length; i++)
      {
        this.registeredObjects["time"][i].uniforms.time.value = this.timeCount;
      }
    }
  }
}