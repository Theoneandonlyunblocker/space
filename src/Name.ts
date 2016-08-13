import NameSaveData from "./savedata/NameSaveData";

export default class Name
{
  public fullName: string;
  public isPlural: boolean = false;

  constructor(fullName: string, isPlural: boolean = false)
  {
    this.fullName = fullName;
    this.isPlural = isPlural;
  }
  public static fromData(data: NameSaveData)
  {
    return new Name(data.fullName, data.isPlural);
  }
  public toString(): string
  {
    return this.fullName;
  }
  public pluralizeVerb(singularVerb: string, pluralVerb: string): string
  {
    if (this.isPlural)
    {
      return pluralVerb;
    }
    else
    {
      return singularVerb
    }
  }
  public pluralizeVerbWithS(sourceVerb: string): string
  {
    if (sourceVerb.charAt(sourceVerb.length - 1) === "s")
    {
      return this.pluralizeVerb(sourceVerb + "s", sourceVerb)
    }
    else
    {
      return this.pluralizeVerb(sourceVerb, sourceVerb + "s")
    }
  }
  public serialize(): NameSaveData
  {
    return(
    {
      fullName: this.fullName,
      isPlural: this.isPlural
    });
  }
}
