import {LocalizedTextByQuantity} from "../../../src/localization/LocalizedText";

export function sPlural(stem: string): LocalizedTextByQuantity
{
  return(
  {
    1: stem,
    "2..": stem + "s",
  });
}
