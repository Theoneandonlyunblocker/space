import { NameSaveData } from "core/src/savedata/NameSaveData";
import { activeModuleData } from "../app/activeModuleData";


export abstract class Name<
  Tags extends {[tag: string]: any} = {},
  TagsSaveData extends {[K in keyof Tags]: any} = any,
>
{
  // should be abstract and static, but not currently possible in typescript
  // https://github.com/Microsoft/TypeScript/issues/14600
  public abstract readonly languageCode: string;
  public baseName: string;
  public languageSpecificTags: Tags;
  public hasBeenCustomized: boolean = false;

  constructor(baseName: string, languageSpecificTags?: Tags)
  {
    this.baseName = baseName;
    this.languageSpecificTags = {...languageSpecificTags};
  }

  public static fromData(data: NameSaveData)
  {
    const language = activeModuleData.templates.languages[data.languageCode];
    if (!language)
    {
      throw new Error(`Saved name '${data.baseName}' was defined with language code '${data.languageCode}', but said language was not available when trying to load name.`);
    }

    const name = language.constructName(data.baseName);
    name.applyData(data);

    return name;
  }
  public static generateDummyName(): Name
  {
    const languageKey = Object.keys(activeModuleData.templates.languages)[0];
    const language = activeModuleData.templates.languages[languageKey];

    return language.constructName("dummy");
  }

  public abstract applyData(data: NameSaveData<TagsSaveData>): void;
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
  public customize(newName: string, tags?: Partial<Tags>): void
  {
    this.hasBeenCustomized = true;
    this.baseName = newName;
    if (tags)
    {
      this.languageSpecificTags = {...this.languageSpecificTags, ...tags};
    }
  }
  public toString(): string
  {
    return this.baseName;
  }

  protected abstract serializeTags(): TagsSaveData;
}
