import {Name} from "src/localization/Name";
import { NameSaveData } from "src/savedata/NameSaveData";


export type EnglishNameTags =
{
  definiteArticle: string;
  pronouns:
  {
    thirdPerson: string;
  };
  isPlural: boolean;
};
export type EnglishNameTagsSaveData = EnglishNameTags;

export const defaultEnglishNameTags: EnglishNameTags =
{
  definiteArticle: "",
  pronouns:
  {
    thirdPerson: "they",
  },
  isPlural: false,
};

export class EnglishName extends Name<EnglishNameTags, EnglishNameTagsSaveData>
{
  public readonly languageCode = "en";

  constructor(name: string, tags?: Partial<EnglishNameTags>)
  {
    super(name, {...defaultEnglishNameTags, ...tags});
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
