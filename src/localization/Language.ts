import {Name} from "./Name";


export interface Language<N extends Name = Name>
{
  // try and use ISO 639-1 if possible
  // http://www.loc.gov/standards/iso639-2/php/English_list.php
  code: string;
  // keep display name in english
  displayName: string;
  flagSrc?: string;
  constructName: (name: string, lagnuageSpecificTags?: any) => N;
}
