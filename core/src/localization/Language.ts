import {Name} from "./Name";


export interface Language<N extends Name = Name>
{
  // try and use ISO 639-1 if possible
  // https://iso639-3.sil.org/code_tables/639
  code: string;
  // keep display name in english
  displayName: string;
  flagSrc?: string;
  constructName: (name: string, lagnuageSpecificTags?: any) => N;
}
