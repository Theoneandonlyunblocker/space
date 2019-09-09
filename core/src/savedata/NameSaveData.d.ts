export interface NameSaveData<T extends {[tag: string]: any} = {}>
{
  baseName: string;
  languageCode: string;
  languageSpecificTags?: T;
  hasBeenCustomized: boolean;
}
