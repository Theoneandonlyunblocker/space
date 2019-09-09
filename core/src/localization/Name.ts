import { NameSaveData } from "core/src/savedata/NameSaveData";


export abstract class Name<
  Tags extends {[tag: string]: any} = {},
  TagsSaveData extends {[K in keyof Tags]: any} = any,
>
{
  // should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/14600
  public abstract readonly languageCode: string;
  public baseName: string;
  public languageSpecificTags?: Tags;
  public hasBeenCustomized: boolean = false;

  constructor(baseName: string, languageSpecificTags?: Tags)
  {
    this.baseName = baseName;
    this.languageSpecificTags = {...languageSpecificTags};
  }

  // 'abstract static deserializeTags' would be nicer, but see above
  public abstract copyFromData(data: NameSaveData<TagsSaveData>): void;
  public serialize(): NameSaveData<TagsSaveData>
  {
    return(
    {
      baseName: this.baseName,
      languageCode: this.languageCode,
      languageSpecificTags: this.serializeTags(),
      hasBeenCustomized: this.hasBeenCustomized,
    });
  }
  public customize(newName: string, tags: Tags): void
  {
    this.baseName = newName;
    this.languageSpecificTags = {...this.languageSpecificTags, ...tags};
  }
  public toString(): string
  {
    return this.baseName;
  }

  protected abstract serializeTags(): TagsSaveData;
}
