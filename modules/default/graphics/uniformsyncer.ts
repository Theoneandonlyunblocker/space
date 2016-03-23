module Rance
{
  export type UniformValue = number | number[];
  export type UniformsUpdaterFunction = (time: number) => {[key: string]: UniformValue};

  export interface IUniformsObject
  {
    [uniformKey: string]:
    {
      type: string;
      value: UniformValue;
    }
  }
  export class UniformSyncer
  {
    private uniformTypes: {[key: string]: string};
    private uniforms: IUniformsObject;
    private updaterFunction: UniformsUpdaterFunction;

    constructor(uniformTypes: {[key: string]: string},
      updaterFunction: UniformsUpdaterFunction)
    {
      this.uniformTypes = uniformTypes;
      this.updaterFunction = updaterFunction;
      this.initUniforms(uniformTypes);
    }
    private initUniforms(uniformTypes: {[key: string]: string})
    {
      for (var key in uniformTypes)
      {
        this.uniforms[key] =
        {
          type: uniformTypes[key],
          value: undefined
        }
      }
    }
    public sync(time: number)
    {
      var newValues = this.updaterFunction(time);
      for (var key in newValues)
      {
        this.uniforms[key].value = newValues[key];
      }
    }
    public set(key: string, value: UniformValue)
    {
      this.uniforms[key].value = value;
    }
    public getUniformsObject()
    {
      return this.uniforms;
    }
    public makeClone()
    {
      return new UniformSyncer(this.uniformTypes, this.updaterFunction);
    }
  }
}
