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
  public serialize(): NameSaveData
  {
    return(
    {
      fullName: this.fullName,
      isPlural: this.isPlural
    });
  }
}
