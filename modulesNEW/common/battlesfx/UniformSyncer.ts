type UniformValue = number | number[];
type UniformsUpdaterFunction = (time: number) => {[key: string]: UniformValue};

interface UniformTypesObject
{
  [key: string]: string;
}
interface UniformsObject
{
  [uniformKey: string]:
  {
    type: string;
    value: UniformValue;
  }
}
export default class UniformSyncer
{
  private uniformTypes: UniformTypesObject;
  private uniforms: UniformsObject;
  private updaterFunction: UniformsUpdaterFunction;

  constructor(uniformTypes: UniformTypesObject,
    updaterFunction: UniformsUpdaterFunction)
  {
    this.uniformTypes = uniformTypes;
    this.updaterFunction = updaterFunction;
    this.initUniforms(uniformTypes);
  }
  private initUniforms(uniformTypes: UniformTypesObject)
  {
    this.uniforms = {};

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
