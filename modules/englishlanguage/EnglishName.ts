import {Name} from "../../src/localization/Name";
import { NameSaveData } from "src/savedata/NameSaveData";


export type EnglishNameTags =
{
  definiteArticle: string;
  isPlural: boolean;
};
export type EnglishNameTagsSaveData = EnglishNameTags;

const defaultTags: EnglishNameTags =
{
  definiteArticle: "",
  isPlural: false,
};

export class EnglishName extends Name<EnglishNameTags, EnglishNameTagsSaveData>
{
  public readonly languageCode = "en";

  constructor(name: string, tags?: Partial<EnglishNameTags>)
  {
    super(name, {...defaultTags, ...tags});
  }

  public copyFromData(data: NameSaveData<EnglishNameTagsSaveData>)
  {
    this.languageSpecificTags = {...data.languageSpecificTags};
    this.hasBeenCustomized = data.hasBeenCustomized;
  }

  protected serializeTags(): EnglishNameTagsSaveData
  {
    return {...this.languageSpecificTags};
  }
}
