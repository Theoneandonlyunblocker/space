export interface Language
{
  // try and use ISO 639-1 if possible
  // http://www.loc.gov/standards/iso639-2/php/English_list.php
  code: string;
  // keep display name in english
  displayName: string;
  flagSrc?: string;

  // getSubjectPronoun(characters: ...Character[]): string;
  // getObjectPronoun(characters: ...Character[]): string;
  // getPossessivePronoun(characters: ...Character[]): string;
}
